import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";
import { addToInbox, moveInInbox, removeFromInbox } from "./inboxUtils";

class Result {
  type: "error" | "success";
  message: string;

  constructor(type: "error" | "success", message: string) {
    this.type = type;
    this.message =
      type.charAt(0).toUpperCase() + type.slice(1) + ". " + message;
  }
}

export const getRequestAndType = async (requestId: string) => {
  const req: db.Request | null = await db.request.findOne({ _id: requestId });
  if (!req) {
    return {
      req: null,
      reqType: null,
      error: {
        type: "error",
        message: "Error. Request could not be found in database",
      },
    };
  }

  const reqType: db.RequestType | null = await db.requestType.findOne({
    _id: req.requestTypeId,
  });
  if (!reqType) {
    return {
      req: null,
      reqType: null,
      error: {
        type: "error",
        message: "Error. Request Type could not be found in database",
      },
    };
  }

  return { req: req, reqType: reqType, error: null };
};

export const passRequest = async (
  request: db.Request,
  requestType: db.RequestType,
  nextHandlerId: string,
) => {
  // Ensure that the next handler exists
  const nextHandler = await db.user.findOne({ _id: nextHandlerId });
  if (!nextHandler)
    return new Result("error", "Selected handler not found in database.");

  const oldStageIndex = request.currentStage.stageTypeIndex;
  const newStageIndex = oldStageIndex + 1;
  const newNextStageIndex = newStageIndex + 1;
  request.currentStage.finished = true;
  request.currentStage.dateFinished = new Date();

  // Update request
  const newHistory = [...request.history, request.currentStage];
  const newCurrentStage: db.Stage = {
    stageTypeIndex: newStageIndex,
    handlerId: nextHandlerId,
    finished: false,
    dateStarted: new Date(),
    dateFinished: new Date(0),
    roomId: new ObjectId().toString(),
  };
  const newNextHandlerId =
    requestType.stages[newNextStageIndex]?.defaultHandlerId ?? "";

  let requestUpdateResult = await db.request.findOneAndUpdate(
    { _id: request._id },
    {
      $set: {
        history: newHistory,
        currentStage: newCurrentStage,
        nextHandlerId: newNextHandlerId,
      },
    },
  );

  if (!requestUpdateResult)
    return new Result("error", "Database failed to update stage's request");

  await addToInbox(nextHandlerId, "current", {
    requestId: request._id,
    stageTypeIndex: newStageIndex,
  });

  // Update Inbox that sent request - active -> pending
  await moveInInbox(request.currentStage.handlerId, "current", {
    requestId: request._id,
    stageTypeIndex: oldStageIndex,
  });

  return new Result("success", "Request passed to next handler");
};

export const fullyFinishRequest = async (request: db.Request) => {
  // Update request
  request.currentStage.finished = true;
  request.currentStage.dateFinished = new Date();

  const newHistory = [...request.history, request.currentStage];
  const newNextHandlerId = "";
  let requestUpdateResult = await db.request.findOneAndUpdate(
    { _id: request._id },
    {
      $set: {
        history: newHistory,
        currentStage: request.currentStage,
        nextHandlerId: newNextHandlerId,
        isFinished: true,
      },
    },
  );
  if (!requestUpdateResult)
    return new Result("error", "Database failed to update stage's request");

  const archiveResult = await addToArchive(request._id);
  if (archiveResult.type === "error") {
    return archiveResult;
  }

  // Remove request from pending of all inboxes that would still have it
  let index = request.currentStage.stageTypeIndex - 1;
  for (let i = request.history.length - 1; i >= 0; i--) {
    if (index < 0) break;
    if (request.history[i].stageTypeIndex != index) continue;

    const handlerId = request.history[i].handlerId;
    await removeFromInbox(handlerId, "recallable", {
      requestId: request._id,
      stageTypeIndex: index,
    });

    index--;
  }

  //Remove request from current handler
  await removeFromInbox(request.currentStage.handlerId, "current", {
    requestId: request._id,
    stageTypeIndex: request.currentStage.stageTypeIndex,
  });

  return new Result("success", "Request moved to archive");
};

const addToArchive = async (requestId: string) => {
  let archive: db.Archive | null = await db.archive.findOne();
  if (!archive) {
    archive = {
      _id: new ObjectId().toString(),
      requestIds: [requestId],
    };
    await db.archive.insertOne(archive);
    return new Result("success", "Updated archive");
  }

  archive.requestIds.push(requestId);

  const updateResult = await db.archive.updateOne(
    { _id: archive._id },
    {
      $set: { requestIds: archive.requestIds },
    },
  );

  if (!updateResult.acknowledged)
    return new Result("error", "Database failed to update archive");
  else return new Result("success", "Successfully updated archive");
};

export const rollbackStage = async (
  request: db.Request,
  requestType: db.RequestType,
  userId: string,
  rollbackStageIndex: number,
) => {
  const currentHandlerId = request.currentStage.handlerId;
  const currentStageIndex = request.currentStage.stageTypeIndex;
  const newCurrentStageIndex = rollbackStageIndex;
  request.currentStage.finished = false;
  request.currentStage.dateFinished = new Date(0);

  // Update Request
  const newHistory = [...request.history, request.currentStage];
  const newCurrentStage: db.Stage = {
    stageTypeIndex: newCurrentStageIndex,
    handlerId: userId,
    finished: false,
    dateStarted: new Date(),
    dateFinished: new Date(0),
    roomId: new ObjectId().toString(),
  };
  const newNextStageIndex = newCurrentStageIndex + 1;
  let newNextHandlerId = "";
  if (requestType.stages.length > newNextStageIndex)
    newNextHandlerId = requestType.stages[newNextStageIndex].defaultHandlerId;

  let requestUpdateResult = await db.request.findOneAndUpdate(
    { _id: request._id },
    {
      $set: {
        history: newHistory,
        currentStage: newCurrentStage,
        nextHandlerId: newNextHandlerId,
      },
    },
  );
  if (!requestUpdateResult) return;

  await removeFromInbox(currentHandlerId, "current", {
    requestId: request._id,
    stageTypeIndex: currentStageIndex,
  });

  // Remove all stages from pending inboxes until (inclusive) the stage the rollback is called from
  for (let i = request.history.length - 1; i >= 0; i--) {
    if (request.history[i].stageTypeIndex < rollbackStageIndex) break;

    const stage = request.history[i];

    await removeFromInbox(stage.handlerId, "recallable", {
      requestId: request._id,
      stageTypeIndex: stage.stageTypeIndex,
    });
  }

  await addToInbox(userId, "current", {
    requestId: request._id,
    stageTypeIndex: rollbackStageIndex,
  });

  return new Result("success", "Rolled back stage");
};

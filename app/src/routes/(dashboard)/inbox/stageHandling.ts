import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";
import {
  addToInbox,
  moveInInbox,
  removeFromAllInboxes,
  removeFromInbox,
  removeFromPendingInboxes,
} from "$lib/server/inboxUtils";

class Result {
  type: "error" | "success";
  message: string;

  constructor(type: "error" | "success", message: string) {
    this.type = type;
    this.message =
      type.charAt(0).toUpperCase() + type.slice(1) + ". " + message;
  }
}

export async function getRequestAndType(requestId: string) {
  const req: db.Request | null = await db.request.findOne({ _id: requestId });
  if (!req) {
    return {
      req: null,
      reqType: null,
      error: new Result(
        "error",
        "Error. Request could not be found in database",
      ),
    };
  }

  const reqType: db.RequestType | null = await db.requestType.findOne({
    _id: req.requestTypeId,
  });
  if (!reqType) {
    return {
      req: null,
      reqType: null,
      error: new Result(
        "error",
        "Error. Request Type could not be found in database",
      ),
    };
  }

  return { req: req, reqType: reqType, error: null };
}

export async function passRequest(
  request: db.Request,
  requestType: db.RequestType,
  nextHandlerId: string,
) {
  // Ensure that the next handler exists
  const nextHandler = await db.user.findOne({ _id: nextHandlerId });
  if (!nextHandler)
    return new Result("error", "Selected handler not found in database.");

  const oldStageIndex = request.currentStage.stageTypeIndex;
  const newStageIndex = oldStageIndex + 1;
  const newNextStageIndex = newStageIndex + 1;

  const oldStage = { ...request.currentStage };
  oldStage.finished = true;
  oldStage.dateFinished = new Date();

  // Update request
  const newHistory = [...request.history, oldStage];
  const newCurrentStage: db.Stage = {
    stageTypeIndex: newStageIndex,
    handlerId: nextHandlerId,
    prevHandlerId: oldStage.handlerId,
    finished: false,
    dateStarted: new Date(),
    dateFinished: new Date(0),
    remarks: "",
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
}

// Mark as finished and update stages and history
// Remove from all inboxes
export async function finishRequest(request: db.Request) {
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

  await removeFromAllInboxes(request);

  return new Result("success", "Request fully finished");
}

// Mark as finished without updating anything else
// Remove from all inboxes
export async function markRequestAsStale(request: db.Request) {
  let requestUpdateResult = await db.request.findOneAndUpdate(
    { _id: request._id },
    { $set: { isFinished: true }
    },
  );

  if (!requestUpdateResult)
    return new Result("error", "Database failed to update stage's request");

  await removeFromAllInboxes(request);

  return new Result("success", "Request marked as stale");
}

export async function rollbackStage(
  request: db.Request,
  requestType: db.RequestType,
  userId: string,
  rollbackStageIndex: number,
) {
  const currentHandlerId = request.currentStage.handlerId;
  const currentStageIndex = request.currentStage.stageTypeIndex;
  const newCurrentStageIndex = rollbackStageIndex;

  const oldStage = { ...request.currentStage };
  oldStage.finished = false;
  oldStage.dateFinished = new Date();

  // Update Request
  const newHistory = [...request.history, oldStage];
  const newCurrentStage: db.Stage = {
    stageTypeIndex: newCurrentStageIndex,
    handlerId: userId,
    prevHandlerId: request.currentStage.handlerId,
    finished: false,
    dateStarted: new Date(),
    dateFinished: new Date(0),
    remarks: "Rolled Back",
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

  return new Result(
    "success",
    `Rolled back request to stage ${rollbackStageIndex}`,
  );
}

export async function reassign(request: db.Request, newHandlerId: string) {
  // Ensure the selected handler is valid
  const newHandler = await db.user.findOne({ _id: newHandlerId });
  if (!newHandler)
    return new Result("error", "Selected handler not found in database.");

  const oldHandlerId = request.currentStage.handlerId;

  // Don't allow reassigning to self
  if (oldHandlerId === newHandlerId)
    return new Result(
      "error",
      "Selected handler is already handling this stage",
    );

  const oldStage = { ...request.currentStage };
  oldStage.dateFinished = new Date();

  const newCurrentStage: db.Stage = {
    stageTypeIndex: request.currentStage.stageTypeIndex,
    handlerId: newHandlerId,
    prevHandlerId: oldHandlerId,
    finished: false,
    dateStarted: new Date(),
    dateFinished: new Date(0),
    remarks: "Reassigned",
  };

  const newHistory = [...request.history, oldStage];

  // Update request's currentStage and history.
  await db.request.updateOne(
    { _id: request._id },
    { $set: { currentStage: newCurrentStage, history: newHistory } },
  );

  // Add and remove from inboxes
  const stageIdentifier: db.StageIdentifier = {
    requestId: request._id,
    stageTypeIndex: request.currentStage.stageTypeIndex,
  };

  await addToInbox(newHandlerId, "current", stageIdentifier);

  await removeFromInbox(oldHandlerId, "current", stageIdentifier);

  return new Result("success", "Reassigned request");
}

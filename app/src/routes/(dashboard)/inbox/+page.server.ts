import type { PageServerLoad, Actions } from "./$types";
import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";

import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth";

import {
  addToInbox,
  existsInInbox,
  getInbox,
  moveInInbox,
  removeFromInbox,
} from "./inboxUtils";

interface InboxStageData {
  requestTitle: string;
  stageTitle: string;
  dateSent: Date;
  requestId: string;
  handlerId: string;
  currentStageTypeIndex: number;
  inboxStageTypeIndex: number;
  finished: boolean;
  roomId: string;
}

export const load: PageServerLoad = async ({ cookies, locals }) => {
  const sessionId = cookies.get(lucia.sessionCookieName);
  const userId = locals.user?.id ?? "0";
  // const requests = await database.request.find({}).toArray();

  const users = await getUsers();
  const userInbox: db.Inbox = await getInbox(userId);
  const requestTypes = await getRequestTypes();

  const reqAndStages = await getRequestsAndStages(userInbox, requestTypes);
  const requests = reqAndStages.requests;
  const activeStages = reqAndStages.activeStages;
  const pendingStages = reqAndStages.pendingStages;

  return {
    form: await superValidate(zod(formSchema)),
    userInfo: locals.user!,
    sessionId: sessionId!,
    requestTypes: requestTypes,
    relevantRequests: requests,
    activeStages: activeStages,
    pendingStages: pendingStages,
    users: users,
  };
};

const getUsers = async () => {
  const cursor = db.user.find();
  const users: { [_id: string]: { name: string; profileUrl: string } } = {};
  for await (const user of cursor) {
    users[user._id] = { name: user.name, profileUrl: user.profileUrl };
  }

  return users;
};

const getRequestTypes = async (): Promise<{
  [key: string]: db.RequestType;
}> => {
  let requestTypes: { [key: string]: db.RequestType } = {};
  let cursor = db.requestType.find();
  for await (const reqType of cursor) {
    requestTypes[reqType._id] = reqType;
  }

  return requestTypes;
};

// get all requests that are relevant to user - either active or pending
const getRequestsAndStages = async (
  userInbox: db.Inbox,
  requestTypes: { [key: string]: db.RequestType },
) => {
  let activeStages: InboxStageData[] = [];
  let pendingStages: InboxStageData[] = [];

  let requests: { [key: string]: db.Request } = {};
  for (const stageIdentifier of userInbox.current) {
    const req = await db.request.findOne({ _id: stageIdentifier.requestId });
    if (!req) continue;

    requests[stageIdentifier.requestId] = req;
    const requestType = requestTypes[req.requestTypeId];
    addStage(stageIdentifier, req, requestType, activeStages);
  }

  for (const stageIdentifier of userInbox.recallable) {
    const req = await db.request.findOne({ _id: stageIdentifier.requestId });
    if (!req) continue;

    requests[stageIdentifier.requestId] = req;
    const requestType = requestTypes[req.requestTypeId];
    addStage(stageIdentifier, req, requestType, pendingStages);
  }

  return {
    requests: requests,
    activeStages: activeStages,
    pendingStages: pendingStages,
  };
};

const addStage = (
  stageIdentifier: db.StageIdentifier,
  request: db.Request,
  requestType: db.RequestType,
  listToAppendTo: InboxStageData[],
) => {
  const stage = request.currentStage;

  listToAppendTo.push({
    requestTitle: requestType.title,
    stageTitle: requestType.stages[stage.stageTypeIndex].stageTitle,
    dateSent: stage.dateStarted,
    requestId: stageIdentifier.requestId,
    handlerId: stage.handlerId,
    currentStageTypeIndex: stage.stageTypeIndex,
    inboxStageTypeIndex: stageIdentifier.stageTypeIndex,
    finished: stage.finished,
    roomId: stage.roomId,
  });
};

import { setFlash } from "sveltekit-flash-message/server";

export const actions: Actions = {
  add_request: async (event) => {
    const { request, locals, cookies } = event;
    const userId = locals.user?.id ?? "0";

    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      setFlash({ type: "error", message: "Invalid form sent" }, cookies);
      return fail(400, {
        form,
      });
    }

    const data = form.data;
    const studentName = data.studentName;
    const studentEmail = data.studentEmail;
    const studentNumber = data.studentNumber;
    const requestTypeId = data.requestTypeId;
    const purpose = data.purpose;
    const remarks = data.remarks;

    const reqType = await db.requestType.findOne({ _id: requestTypeId });
    if (!reqType) {
      setFlash({ type: "error", message: "Invalid Request Type" }, cookies);
      return;
    }

    const nextHandlerId =
      reqType.stages.length >= 2 ? reqType.stages[1].defaultHandlerId : "";

    const req: db.Request = {
      _id: new ObjectId().toString(),
      requestTypeId: requestTypeId,
      studentNumber: studentNumber,
      studentName: studentName,
      studentEmail: studentEmail,
      purpose: purpose,
      remarks: remarks,
      isFinished: false,
      currentStage: {
        stageTypeIndex: 0,
        handlerId: userId,
        finished: false,
        dateStarted: new Date(),
        dateFinished: new Date(0),
        roomId: new ObjectId().toString(),
      },
      history: [],
      nextHandlerId: nextHandlerId,
    };

    let insertionResult = await db.request.insertOne(req);
    if (!insertionResult.acknowledged) {
      setFlash(
        { type: "error", message: "Database Error: Request creation failed" },
        cookies,
      );
      return;
    }

    addToInbox(userId, "current", { requestId: req._id, stageTypeIndex: 0 });

    setFlash({ type: "success", message: "Added request" }, cookies);
  },
  finish_stage: async ({ request, locals, cookies }) => {
    const userId = locals.user?.id ?? "0";
    const data = await request.formData();
    const requestId: string = data.get("requestId")?.toString() ?? "";
    const nextHandlerId: string = data.get("nextHandlerId")?.toString() ?? "0";

    // Ensure that the next handler exists
    const nextHandler = await db.user.findOne({ _id: nextHandlerId });
    if (!nextHandler) {
      setFlash(
        {
          type: "error",
          message:
            "Something went wrong. Selected handler could not be found in the database.",
        },
        cookies,
      );
      return;
    }

    // Get request and check if it exists
    const req: db.Request | null = await db.request.findOne({ _id: requestId });
    if (!req) {
      setFlash(
        {
          type: "error",
          message:
            "Something went wrong. Request could not be found in the database",
        },
        cookies,
      );
      return;
    }

    // Get request type and check if it exists
    const reqType: db.RequestType | null = await db.requestType.findOne({
      _id: req.requestTypeId,
    });
    if (!reqType) {
      setFlash(
        {
          type: "error",
          message:
            "Something went wrong. Request Type could not be found in the database",
        },
        cookies,
      );
      return;
    }

    // Check if the request still exists in active
    // Needed in case button is spammed
    const requestExistsInInbox = await existsInInbox(userId, "current", {
      requestId,
      stageTypeIndex: req.currentStage.stageTypeIndex,
    });
    if (!requestExistsInInbox) {
      setFlash(
        {
          type: "error",
          message: "Something went wrong. Stage to finish not in active",
        },
        cookies,
      );
      return;
    }

    const oldStageIndex = req.currentStage.stageTypeIndex;
    const newStageIndex = oldStageIndex + 1;
    req.currentStage.finished = true;
    req.currentStage.dateFinished = new Date();

    //todo handle full finish

    // Update Request
    const newHistory = [...req.history, req.currentStage];
    const newCurrentStage: db.Stage = {
      stageTypeIndex: newStageIndex,
      handlerId: nextHandlerId,
      finished: false,
      dateStarted: new Date(),
      dateFinished: new Date(0),
      roomId: new ObjectId().toString(),
    };
    const newNextStageIndex = newStageIndex + 1;
    let newNextHandlerId = "";
    if (reqType.stages.length > newNextStageIndex)
      newNextHandlerId = reqType.stages[newNextStageIndex].defaultHandlerId;

    let requestUpdateResult = await db.request.findOneAndUpdate(
      { _id: requestId },
      {
        $set: {
          history: newHistory,
          currentStage: newCurrentStage,
          nextHandlerId: newNextHandlerId,
        },
      },
    );
    if (!requestUpdateResult) {
      setFlash(
        { type: "error", message: "Database Error: Request update failed" },
        cookies,
      );
      return;
    }

    await addToInbox(nextHandlerId, "current", {
      requestId: requestId,
      stageTypeIndex: newStageIndex,
    });

    // Update Inbox that sent request - active -> pending
    await moveInInbox(req.currentStage.handlerId, "current", {
      requestId: requestId,
      stageTypeIndex: oldStageIndex,
    });

    // todo remove from all the pending when request is fully completed
    // if (oldStageIndex > 0) {
    //   for (let i = req.history.length - 1; i >= 0; i--) {
    //     if (req.history[i].stageTypeIndex != oldStageIndex) continue;

    //     const prevHandlerId = req.history[i].handlerId;
    //     const prevInbox = await getInbox(prevHandlerId);

    //     const newRecallable = prevInbox.recallable.filter(
    //       (item) =>
    //         item.stageTypeIndex != oldStageIndex || item.requestId != requestId,
    //     );

    //     await db.inbox.updateOne(
    //       { userId: prevHandlerId },
    //       {
    //         $set: {
    //           recallable: newRecallable,
    //         },
    //       },
    //     );

    //     break;
    //   }
    // }
  },
  rollback_stage: async ({ locals, request, cookies }) => {
    const userId = locals.user?.id ?? "0";
    const data = await request.formData();
    const requestId: string = data.get("requestId")?.toString() ?? "";
    const rollbackStageIndex: number = parseInt(
      data.get("inboxStageTypeIndex")?.toString() ?? "-1",
    );

    // Check if request still exists in pending
    // Needed in case button is spammed
    if (rollbackStageIndex < 0) {
      setFlash(
        {
          type: "error",
          message: "Something went wrong. Invalid stage was selected",
        },
        cookies,
      );
      return;
    }

    const requestExistsInInbox = await existsInInbox(userId, "recallable", {
      requestId,
      stageTypeIndex: rollbackStageIndex,
    });
    if (!requestExistsInInbox) {
      setFlash(
        {
          type: "error",
          message: "Something went wrong. Stage to recall not in pending",
        },
        cookies,
      );
      return;
    }

    // Get Request and make sure it exists
    const req: db.Request | null = await db.request.findOne({ _id: requestId });
    if (!req) {
      setFlash(
        {
          type: "error",
          message: "Something went wrong. Request not found in database.",
        },
        cookies,
      );
      return;
    }

    // Get Request's Request Type and make sure it exists
    const reqType: db.RequestType | null = await db.requestType.findOne({
      _id: req.requestTypeId,
    });
    if (!reqType) {
      setFlash(
        {
          type: "error",
          message:
            "Something went wrong. Request Type could not be found in the database.",
        },
        cookies,
      );
      return;
    }

    const currentHandlerId = req.currentStage.handlerId;
    const currentStageIndex = req.currentStage.stageTypeIndex;
    const newCurrentStageIndex = rollbackStageIndex;
    req.currentStage.finished = false;
    req.currentStage.dateFinished = new Date(0);

    // Update Request
    const newHistory = [...req.history, req.currentStage];
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
    if (reqType.stages.length > newNextStageIndex)
      newNextHandlerId = reqType.stages[newNextStageIndex].defaultHandlerId;

    let requestUpdateResult = await db.request.findOneAndUpdate(
      { _id: requestId },
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
      requestId: requestId,
      stageTypeIndex: currentStageIndex,
    });

    // Remove all stages from pending inboxes until (inclusive) the stage the rollback is called from
    for (let i = req.history.length - 1; i >= 0; i--) {
      if (req.history[i].stageTypeIndex < rollbackStageIndex) break;

      const stage = req.history[i];

      await removeFromInbox(stage.handlerId, "recallable", {
        requestId: requestId,
        stageTypeIndex: stage.stageTypeIndex,
      });
    }

    await addToInbox(userId, "current", {
      requestId: requestId,
      stageTypeIndex: rollbackStageIndex,
    });
  },
};

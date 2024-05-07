import type { PageServerLoad, Actions } from "./$types";
import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";

import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";

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
  const sessionId = cookies.get("auth_session");
  const userId = locals.user?.id ?? "0";

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

const getInbox = async (userId: string): Promise<db.Inbox> => {
  let userInbox: db.Inbox | null = await db.inbox.findOne({ userId: userId });
  if (!userInbox) {
    userInbox = {
      userId: userId,
      recallable: [],
      current: [],
    };

    await db.inbox.insertOne(userInbox);
  }

  return userInbox;
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

    const userInbox = await getInbox(userId);
    userInbox.current.push({ requestId: req._id, stageTypeIndex: 0 });
    await db.inbox.findOneAndUpdate(
      { userId: userId },
      {
        $set: { current: userInbox.current },
      },
    );

    setFlash({ type: "success", message: "Added request" }, cookies);
  },
  finish_stage: async ({ request, locals, cookies }) => {
    const data = await request.formData();
    const requestId: string = data.get("requestId")?.toString() ?? "";
    const nextHandlerId: string = data.get("nextHandlerId")?.toString() ?? "0";

    // Ensure that the next handler exists
    const nextHandler = await db.user.findOne({ _id: nextHandlerId });
    if (!nextHandler) {
      setFlash(
        {
          type: "error",
          message: "Could not find selected handler in database",
        },
        cookies,
      );
      return;
    }

    const req: db.Request | null = await db.request.findOne({ _id: requestId });
    if (!req) {
      setFlash(
        { type: "error", message: "Could not find request in database" },
        cookies,
      );
      return;
    }

    const reqType: db.RequestType | null = await db.requestType.findOne({
      _id: req.requestTypeId,
    });
    if (!reqType) {
      setFlash(
        { type: "error", message: "Could not find request type in database" },
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
    if (!requestUpdateResult) return; //todo error

    // Update inbox of user who will handle the request
    const receiverInbox = await getInbox(nextHandlerId);

    await db.inbox.updateOne(
      { userId: nextHandlerId },
      {
        $set: {
          current: [
            ...receiverInbox.current,
            { requestId: requestId, stageTypeIndex: newStageIndex },
          ],
        },
      },
    );

    // Update Inbox that just sent the request
    const senderInbox = await getInbox(req.currentStage.handlerId);

    // Add the old stage to recallable
    const newSenderRecallable: db.StageIdentifier[] = [
      ...senderInbox.recallable,
      { requestId: requestId, stageTypeIndex: oldStageIndex },
    ];
    // Remove the old stage from active
    const newSenderCurrent = senderInbox.current.filter(
      (item) =>
        item.stageTypeIndex != oldStageIndex || item.requestId != requestId,
    );
    await db.inbox.updateOne(
      { userId: req.currentStage.handlerId },
      {
        $set: {
          current: newSenderCurrent,
          recallable: newSenderRecallable,
        },
      },
    );

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
  rollback_stage: async ({ locals, request }) => {
    const userId = locals.user?.id ?? "0";
    const data = await request.formData();
    const requestId: string = data.get("requestId")?.toString() ?? "";
    const rollbackStageIndex: number = parseInt(
      data.get("inboxStageTypeIndex")?.toString() ?? "-1",
    );

    if (rollbackStageIndex < 0) return; //todo error

    const req: db.Request | null = await db.request.findOne({ _id: requestId });
    if (!req) return; //todo error

    const reqType: db.RequestType | null = await db.requestType.findOne({
      _id: req.requestTypeId,
    });
    if (!reqType) return; //todo error

    
    const reqCurrentHandlerId = req.currentStage.handlerId;
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

    // Remove from the inbox of the one handling request before recall
    const currentHandlerInbox = await getInbox(req.currentStage.handlerId);
    await db.inbox.updateOne(
      { userId: req.currentStage.handlerId },
      {
        $set: {
          current: currentHandlerInbox.current.filter(
            (item) =>
              item.stageTypeIndex != currentStageIndex ||
              item.requestId != requestId,
          ),
        },
      },
    );

    // Remove all stages from inboxes until (inclusive) the stage the rollback is called from
    for (let i = req.history.length - 1; i >= 0; i--) {
      if (req.history[i].stageTypeIndex < rollbackStageIndex) break;

      const stage = req.history[i];
      const inbox = await getInbox(stage.handlerId);

      await db.inbox.updateOne(
        { userId: inbox.userId },
        {
          $set: {
            recallable: inbox.recallable.filter(
              (item) =>
                item.stageTypeIndex != stage.stageTypeIndex ||
                item.requestId != requestId,
            ),
          },
        },
      );
    }

    // Add to this inbox's active
    const recallerInbox = await getInbox(userId);
    await db.inbox.updateOne(
      { userId: userId },
      {
        $set: {
          current: [...recallerInbox.current, { requestId: requestId, stageTypeIndex: rollbackStageIndex }],
        },
      },
    );
  },
};

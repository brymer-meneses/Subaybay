<<<<<<< HEAD
import type { PageServerLoad, Actions } from "./$types";
import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";
<<<<<<< HEAD
=======
import type { PageServerLoad } from "./$types";
import { lucia } from "$lib/server/auth";
>>>>>>> e9453a1 (commit for now)
=======
import { lucia } from "$lib/server/auth";
>>>>>>> b1188cc (draft for notifications (still not working)

import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth";

<<<<<<< HEAD
interface InboxStageData {
  requestTitle: string;
  stageTitle: string;
  dateSent: Date;
  requestId: string;
  handlerId: string;
  stageTypeIndex: number;
  finished: boolean;
  roomId: string;
}
export const load: PageServerLoad = async ({ cookies, locals }) => {
  const sessionId = cookies.get(lucia.sessionCookieName);
<<<<<<< HEAD
=======
import type { InboxStageData } from "$lib/server/database";

export const load: PageServerLoad = async ({ cookies, locals }) => {
  const sessionId = cookies.get(lucia.sessionCookieName);
>>>>>>> b1188cc (draft for notifications (still not working)
  const userId = locals.user?.id ?? "0";
=======
  // const requests = await database.request.find({}).toArray();
>>>>>>> e9453a1 (commit for now)

  const users = await getUsers();
  const userInbox: db.Inbox = await getInbox(userId);
  const requestTypes = await getRequestTypes();

  const requests = await getRelevantRequests(userInbox);
  const stages = await getStages(userId, requests, requestTypes);
  const activeStages = stages.active;
  const pendingStages = stages.pending;

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
      recallableRequestIds: [],
      currentRequestIds: [],
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
const getRelevantRequests = async (
  userInbox: db.Inbox,
): Promise<{
  [key: string]: db.Request;
}> => {
  let requests: { [key: string]: db.Request } = {};
  for (const requestId of userInbox.currentRequestIds) {
    const req = await db.request.findOne({ _id: requestId });
    if (!req) continue;

    requests[requestId] = req;
  }

  for (const requestId of userInbox.recallableRequestIds) {
    const req = await db.request.findOne({ _id: requestId });
    if (!req) continue;

    requests[requestId] = req;
  }

  return requests;
};

const getStages = async (
  userId: string,
  requests: { [key: string]: db.Request },
  requestTypes: { [key: string]: db.RequestType },
): Promise<{ active: InboxStageData[]; pending: InboxStageData[] }> => {
  let activeStages: InboxStageData[] = [];
  let pendingStages: InboxStageData[] = [];

  for (const reqId of Object.keys(requests)) {
    const request = requests[reqId];
    const requestType = requestTypes[request.requestTypeId];

    let stage = request.currentStage;
    let listToAppendTo;
    if (stage.handlerId == userId) {
      listToAppendTo = activeStages;
    } else {
      if (request.history.length == 0) continue;
      const latestHistory = request.history[request.history.length - 1];
      if (latestHistory.handlerId != userId) continue;

      stage = request.history[request.history.length - 1];
      listToAppendTo = pendingStages;
    }

    listToAppendTo.push({
      requestTitle: requestType.title,
      stageTitle: requestType.stages[stage.stageTypeIndex].stageTitle,
      dateSent: stage.dateStarted,
      requestId: request._id,
      handlerId: stage.handlerId,
      stageTypeIndex: stage.stageTypeIndex,
      finished: stage.finished,
      roomId: stage.roomId,
    });
  }

  return { active: activeStages, pending: pendingStages };
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

    if (!requestTypeId) return; //todo something error

    const reqType = await db.requestType.findOne({ _id: requestTypeId });
    if (!reqType) return;

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
    if (!insertionResult.acknowledged) return; //todo tell about error

    const userInbox = await getInbox(userId);
    userInbox.currentRequestIds.push(req._id);
    await db.inbox.findOneAndUpdate(
      { userId: userId },
      {
        $set: { currentRequestIds: userInbox.currentRequestIds },
      },
    );

    setFlash({ type: "success", message: "Added request" }, cookies);
  },
  finish_stage: async ({ request }) => {
    const data = await request.formData();
    const requestId: string = data.get("requestId")?.toString() ?? "";
    const nextHandlerId: string = data.get("nextHandlerId")?.toString() ?? "0";

    // Ensure that the next handler exists
    const nextHandler = await db.user.findOne({ _id: nextHandlerId });
    if (!nextHandler) {
      console.log("Invalid Next Handler");
      return;
    }

    const req: db.Request | null = await db.request.findOne({ _id: requestId });
    if (!req) return; //todo tell error

    const reqType: db.RequestType | null = await db.requestType.findOne({
      _id: req.requestTypeId,
    });
    if (!reqType) return; //todo tell error

    const currentStageIndex = req.currentStage.stageTypeIndex;
    const newCurrentStageIndex = currentStageIndex + 1;
    req.currentStage.finished = true;
    req.currentStage.dateFinished = new Date();

    // Update Request
    const newHistory = [...req.history, req.currentStage];
    const newCurrentStage: db.Stage = {
      stageTypeIndex: newCurrentStageIndex,
      handlerId: nextHandlerId,
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

    // Update inbox of user who will handle the request
    const receiverInbox = await getInbox(nextHandlerId);

    await db.inbox.updateOne(
      { userId: nextHandlerId },
      {
        $set: {
          currentRequestIds: [...receiverInbox.currentRequestIds, requestId],
        },
      },
    );

    // Update Inbox that just sent the request - move from currentStages -> recallableStages
    const senderInbox = await getInbox(req.currentStage.handlerId);

    const newRecallableRequestIds = [
      ...senderInbox.recallableRequestIds,
      requestId,
    ];
    const newCurrentRequestIds = senderInbox.currentRequestIds.filter(
      (reqId) => reqId != requestId,
    );

    await db.inbox.updateOne(
      { userId: req.currentStage.handlerId },
      {
        $set: {
          currentRequestIds: newCurrentRequestIds,
          recallableRequestIds: newRecallableRequestIds,
        },
      },
    );

    const previousIndex = req.currentStage.stageTypeIndex - 1;
    if (previousIndex >= 0) {
      for (let i = req.history.length - 1; i >= 0; i--) {
        if (req.history[i].stageTypeIndex != previousIndex) continue;

        const prevHandlerId = req.history[i].handlerId;
        const prevInbox = await getInbox(prevHandlerId);

        const newRecallableRequestIds = prevInbox.recallableRequestIds.filter(
          (reqId) => reqId != requestId,
        );

        await db.inbox.updateOne(
          { userId: prevHandlerId },
          {
            $set: {
              recallableRequestIds: newRecallableRequestIds,
            },
          },
        );

        break;
      }
    }
  },
  recall_stage: async ({ locals, request }) => {
    const userId = locals.user?.id ?? "0";
    const data = await request.formData();
    const requestId: string = data.get("requestId")?.toString() ?? "";

    const req: db.Request | null = await db.request.findOne({ _id: requestId });
    if (!req) return; //todo tell error

    const reqType: db.RequestType | null = await db.requestType.findOne({
      _id: req.requestTypeId,
    });
    if (!reqType) return; //todo tell error

    //todo ensure that the stage being recalled has a stageTypeIndex greater than this user's stage's stageTypeIndex by exactly 1

    const reqCurrentHandlerId = req.currentStage.handlerId;
    const currentStageIndex = req.currentStage.stageTypeIndex;
    const newCurrentStageIndex = currentStageIndex - 1;
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
    const originalInbox = await getInbox(req.currentStage.handlerId);

    const newOrigCurrentRequestIds = originalInbox.currentRequestIds.filter(
      (reqId) => reqId != requestId,
    )
    await db.inbox.updateOne(
      { userId: req.currentStage.handlerId },
      {
        $set: {
          currentRequestIds: newOrigCurrentRequestIds,
        }
      }
    )

    // Move from this inbox's pending to active
    const recallerInbox = await getInbox(userId);

    const newRecallerCurrentRequestIds = [
      ...recallerInbox.currentRequestIds,
      requestId,
    ];
    const newRecallerRecallableRequestIds = recallerInbox.recallableRequestIds.filter(
      (reqId) => reqId != requestId,
    );

    await db.inbox.updateOne(
      { userId: userId },
      {
        $set: {
          currentRequestIds: newRecallerCurrentRequestIds,
          recallableRequestIds: newRecallerRecallableRequestIds,
        },
      },
    );
  },
};

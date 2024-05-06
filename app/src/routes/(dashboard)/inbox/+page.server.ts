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
  stageTypeIndex: number;
  finished: boolean;
}
export const load: PageServerLoad = async ({ cookies, locals }) => {
  const sessionId = cookies.get("auth_session");
  const userId = locals.user?.id ?? "0";

  const userInbox: db.Inbox = await getUserInbox(userId);
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
  };
};

const getUserInbox = async (userId: string): Promise<db.Inbox> => {
  let userInbox: db.Inbox | null = await db.inbox.findOne({ userId: userId });
  if (!userInbox) {
    userInbox = {
      userId: userId,
      recallableRequestIds: [],
      currentRequestIds: [],
    };

    db.inbox.insertOne(userInbox);
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

    const userInbox = await getUserInbox(userId);
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
    const stageTypeIndex: number = parseInt(
      data.get("stageTypeIndex")?.toString() ?? "-1",
      10,
    );
    const nextHandlerId: string = data.get("nextHandlerId")?.toString() ?? "0";
    //todo ensure that nextHandler exists

    const req: db.Request | null = await db.request.findOne({ _id: requestId });
    if (!req) return; //todo tell error

    const reqType: db.RequestType | null = await db.requestType.findOne({
      _id: req.requestTypeId,
    });
    if (!reqType) return; //todo tell error

    req.currentStage.finished = true;

    // Update Request
    const newHistory = [...req.history, req.currentStage];
    const newCurrentStage: db.Stage = {
      stageTypeIndex: 0,
      handlerId: req.nextHandlerId,
      finished: false,
      dateStarted: new Date(),
      dateFinished: new Date(0),
      roomId: new ObjectId().toString(),
    };
    const nextStageIndex = req.currentStage.stageTypeIndex + 1;
    let newNextHandlerId = "";
    if (reqType.stages.length > nextStageIndex)
      newNextHandlerId = reqType.stages[nextStageIndex].defaultHandlerId;

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

    // Update Inbox that just sent the request - move from currentStages -> recallableStages
    const senderInbox = await db.inbox.findOne({
      userId: req.currentStage.handlerId,
    });
    if (!senderInbox) return;

    const newRecallableRequestIds = [...senderInbox.recallableRequestIds, requestId];
    const newCurrentRequestIds = senderInbox.currentRequestIds.filter(
      (reqId) => reqId != requestId,
    );

    await db.inbox.updateOne(
      { userId: req.currentStage.handlerId },
      {
        $set: {
          currentRequestIds: newCurrentRequestIds,
          recallableRequestIds: newRecallableRequestIds
        }
      }
    )

    // Update inbox of user who will handle the request
    const receiverInbox = await db.inbox.findOne({
      userId: nextHandlerId
    })
    if (!receiverInbox) return;
    
    await db.inbox.updateOne(
      { userId: nextHandlerId },
      {
        $set: {
          currentRequestIds: [...receiverInbox.currentRequestIds, requestId]
        }
      }
    )
  },
  recall_stage: async (event) => {
    //todo check for stage in currentStages,
    //+ if it isn't there check if it's in history, if it's in currentStages, then that means it's partial, which is ez to send back
    //todo when doing a full recall, gether all stages in history at currentStageTypeIndex - 1,
    //+ but don't go futher than one leve, like once it's currentStageTypeIndex - 2, break the loop
  },
};

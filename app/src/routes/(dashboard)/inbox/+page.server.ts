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
}

export const load: PageServerLoad = async ({ cookies, locals }) => {
  const sessionId = cookies.get("auth_session");
  const userId = locals.user?.id ?? "0";

  let userInbox: db.Inbox | null = await db.inbox.findOne({ userId: userId });
  if (!userInbox) {
    userInbox = {
      userId: userId,
      recallableRequestIds: [],
      currentRequestIds: [],
    };

    db.inbox.insertOne(userInbox);
  }

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

    let isRecallableRequest = true;
    for (const stage of request.currentStages) {
      if (!stage) continue;
      if (stage.handlerId != userId) continue;

      isRecallableRequest = false;
      const requestType = requestTypes[request.requestTypeId];

      const stageTitle =
        requestType.stages[stage.stageTypeIndex][stage.substageTypeIndex]
          .stageTitle;
      activeStages.push({
        requestTitle: requestType.title,
        stageTitle: stageTitle,
        dateSent: stage.dateStarted,
        requestId: request._id,
        handlerId: stage.handlerId,
      });
    }

    if (isRecallableRequest) {
      const latestStageTypeIndex = request.currentStages[0].stageTypeIndex;

      for (let i = request.history.length - 1; i >= 0; i--) {
        const stage = request.history[i];
        if (stage.stageTypeIndex < latestStageTypeIndex - 1) break;

        const requestType = requestTypes[request.requestTypeId];
        const stageTitle =
          requestType.stages[stage.stageTypeIndex][stage.substageTypeIndex]
            .stageTitle;
        pendingStages.push({
          requestTitle: requestType.title,
          stageTitle: stageTitle,
          dateSent: stage.dateStarted,
          requestId: request._id,
          handlerId: stage.handlerId,
        });
      }
    }
  }
  //todo handle possible errors

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

    const nextStages: db.Stage[] = [];
    //todo handle possibility that stages.length < 2
    if (reqType.stages.length >= 2) {
      reqType.stages[1].forEach((stageType, index) => {
        nextStages.push({
          stageTypeIndex: 1,
          substageTypeIndex: index,
          handlerId: stageType.defaultHandlerId,
          finished: false,
          dateStarted: new Date(0),
          dateFinished: new Date(0),
          roomId: new ObjectId().toString(),
        });
      });
    }

    const req: db.Request = {
      _id: new ObjectId().toString(),
      requestTypeId: requestTypeId,
      studentNumber: studentNumber,
      studentName: studentName,
      studentEmail: studentEmail,
      purpose: purpose,
      remarks: remarks,
      isFinished: false,
      currentStages: [
        {
          stageTypeIndex: 0,
          substageTypeIndex: 0,
          handlerId: userId,
          finished: false,
          dateStarted: new Date(),
          dateFinished: new Date(0),
          roomId: new ObjectId().toString(),
        },
      ],
      nextStages: nextStages,
      history: [],
    };

    await db.request.insertOne(req);
    //todo don't do the below if unsuccessful

    let userInbox: db.Inbox | null = await db.inbox.findOne({ userId: userId });
    if (!userInbox) {
      userInbox = {
        userId: userId,
        recallableRequestIds: [],
        currentRequestIds: [],
      };
    }

    userInbox.currentRequestIds.push(req._id);
    await db.inbox.findOneAndUpdate(
      { userId: userId },
      {
        $set: { currentRequestIds: userInbox.currentRequestIds },
      },
    );

    setFlash({ type: "success", message: "Added request" }, cookies);
  },
  set_stage_handlers: async (event) => {

  },
  finish_stage: async (event) => {
    //todo update stage finished = true
    //todo check if all other currentStages are finished, if so, pass on to the next person

  },
  recall_stage: async (event) => {

  },
  reassign_stage: async (event) => {

  },
};

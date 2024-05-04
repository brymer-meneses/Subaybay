import type { PageServerLoad, Actions } from "./$types";
import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";

interface InboxStageData {
  requestTitle: string;
  stageTitle: string;
  dateSent: Date;
  requestId: string;
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
  const currentRequests = await getCurrentRequests(userInbox);
  const stages = await getInboxStages(userId, currentRequests, requestTypes);

  return {
    userInfo: locals.user!,
    sessionId: sessionId!,
    requestTypes: requestTypes,
    currentRequests: currentRequests,
    currentStages: stages,
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

const getCurrentRequests = async (
  userInbox: db.Inbox,
): Promise<{
  [key: string]: db.Request;
}> => {
  let currentRequests: { [key: string]: db.Request } = {}
  for (const requestId of userInbox.currentRequestIds) {
    const req = await db.request.findOne({ _id: requestId });
    if (!req) continue;

    currentRequests[requestId] = req;
  }

  return currentRequests;
};

const getInboxStages = async (
  userId: string,
  currentRequests: { [key: string]: db.Request },
  requestTypes: { [key: string]: db.RequestType },
) => {
  let stages: InboxStageData[] = [];
  for (const reqId of Object.keys(currentRequests)) {
    const request = currentRequests[reqId];
    for (const stage of request.currentStages) {
      if (stage.handlerId != userId) continue;
      const requestType = requestTypes[request.requestTypeId];

      stages.push({
        requestTitle: requestType.title,
        stageTitle:
          requestType.stages[stage.stageTypeIndex][stage.substageTypeIndex]
            .stageTitle,
        dateSent: stage.dateStarted,
        requestId: request._id
      });
    }
  }
  //todo handle possible errors

  return stages;
};

export const actions: Actions = {
  add_request: async ({ request, locals }) => {
    const userId = locals.user?.id ?? "0";

    const data = await request.formData();

    const studentName: string = data.get("studentName")?.toString() || "";
    const studentEmail = data.get("studentEmail")?.toString() ?? "";
    const studentNumber = data.get("studentNumber")?.toString() ?? "";
    const requestTypeId = data.get("requestTypeId")?.toString() ?? "";
    const purpose = data.get("purpose")?.toString() ?? "";
    const remarks = data.get("remarks")?.toString() ?? "";

    if (!requestTypeId) return; //todo something error

    const reqType = await db.requestType.findOne({ _id: requestTypeId });
    if (!reqType) return;

    const nextStages: db.Stage[] = [];
    //todo handle possibility that stages.length < 2
    reqType.stages[1].forEach((stageType, index) => {
      nextStages.push({
        stageTypeIndex: 1,
        substageTypeIndex: index,
        handlerId: stageType.defaultHandlerId,
        finished: false,
        dateStarted: new Date(0),
        dateFinished: new Date(0),
        roomId: new ObjectId().toString()
      });
    });

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
          roomId: new ObjectId().toString()
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
  },
};

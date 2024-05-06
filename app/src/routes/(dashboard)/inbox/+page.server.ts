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
  substageTypeIndex: number;
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
        stageTypeIndex: stage.stageTypeIndex,
        substageTypeIndex: stage.substageTypeIndex,
        finished: stage.finished
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
          stageTypeIndex: stage.stageTypeIndex,
          substageTypeIndex: stage.substageTypeIndex,
          finished: stage.finished
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

    let insertionResult = await db.request.insertOne(req);
    if (!insertionResult.acknowledged) return; //todo tell about error

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
  set_stage_handlers: async (event) => {},
  finish_stage: async ({ request }) => {
    const data = await request.formData();
    const requestId: string = data.get("requestId")?.toString() ?? "";
    const stageTypeIndex: number =
      parseInt(data.get("stageTypeIndex")?.toString() ?? "-1", 10);
    const substageTypeIndex: number =
      parseInt(data.get("substageTypeIndex")?.toString() ?? "-1", 10);

    const req: db.Request | null = await db.request.findOne({ _id: requestId });
    if (!req) return; //todo tell error

    const reqType: db.RequestType | null = await db.requestType.findOne({
      _id: req.requestTypeId,
    });
    if (!reqType) return; //todo tell error

    let allFinished = true;
    for (const stage of req.currentStages) {
      if (
        stage.stageTypeIndex == stageTypeIndex &&
        stage.substageTypeIndex == substageTypeIndex
      )
      {
        stage.finished = true;
      }

      if (!stage.finished) allFinished = false;
    }

    if (allFinished) {
      // todo don't allow passing of request if any nextStage handler is still null
      // todo handle: nextStages.Count == 0, meaning that this is the final stage
      // Update Request - move to next superstage
      const currentStageTypeIndex = req.currentStages[0].stageTypeIndex;
      const history = [...req.history, ...req.currentStages];
      const previousStages = req.currentStages;
      const currentStages = req.nextStages;

      const nextStages: db.Stage[] = [];
      if (reqType.stages.length >= currentStageTypeIndex + 1) {
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

      let requestUpdateResult = await db.request.findOneAndUpdate(
        { _id: requestId },
        {
          $set: {
            history: history,
            currentStages: currentStages,
            nextStages: nextStages,
          },
        },
      );
      if (!requestUpdateResult) return;

      // Update all inboxes that had the request
      for (const stage of previousStages) {
        const inbox = await db.inbox.findOne({ userId: stage.handlerId });
        if (!inbox) continue;

        const newRecallableRequestIds = [...inbox.recallableRequestIds, requestId];
        const newCurrentRequestIds = inbox.currentRequestIds.filter(reqId => reqId != requestId);

        await db.inbox.updateOne(
          { userId: stage.handlerId },
          {
            $set: {
              currentRequestIds: newCurrentRequestIds,
              recallableRequestIds: newRecallableRequestIds
            }
          }
        )
      }
    
      // Update all inboxes which will handle the request
      //! this can causes duplicate instance of a request if a user is handling two stages under the same superstage
      for (const stage of currentStages) {
        const inbox = await db.inbox.findOne({ userId: stage.handlerId });
        if (!inbox) continue;

        await db.inbox.updateOne(
          { userId: stage.handlerId },
          {
            $set: {
              currentRequestIds: [...inbox.currentRequestIds, requestId]
            },
          },
        );
      }
    }
    // if !allFinished
    else {
      // Update this inbox, if this is the only request in 
      for (const stage of req.currentStages) {
        const inbox = await db.inbox.findOne({ userId: stage.handlerId });
        if (!inbox) continue;

        const newRecallableRequestIds = [...inbox.recallableRequestIds, requestId];
        const newCurrentRequestIds = inbox.currentRequestIds.filter(reqId => reqId != requestId);

        await db.inbox.updateOne(
          { userId: stage.handlerId },
          {
            $set: {
              currentRequestIds: newCurrentRequestIds,
              recallableRequestIds: newRecallableRequestIds
            }
          }
        )
      }
      //todo update currentStages
      //todo move request to recallable
    }
  },
  recall_stage: async (event) => {
    //todo check for stage in currentStages,
    //+ if it isn't there check if it's in history, if it's in currentStages, then that means it's partial, which is ez to send back
    //todo when doing a full recall, gether all stages in history at currentStageTypeIndex - 1,
    //+ but don't go futher than one leve, like once it's currentStageTypeIndex - 2, break the loop
  },
};

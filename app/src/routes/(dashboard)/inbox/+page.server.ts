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
import {
  fullyFinishRequest,
  getRequestAndType,
  passRequest,
  rollbackStage,
} from "./stageHandling";

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

    // Get Request and its RequestType
    const { req: req, reqType: reqType, error: reqError } = await getRequestAndType(requestId);
    if (!req || !reqType) {
      setFlash(reqError, cookies);
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
          message: "Error. Stage not in active inbox",
        },
        cookies,
      );
      return;
    }

    let result: any;
    const onFinalStage =
      req.currentStage.stageTypeIndex == reqType.stages.length - 1;
    if (onFinalStage) {
      result = await fullyFinishRequest(req);
    } else {
      result = await passRequest(req, reqType, nextHandlerId);
    }

    setFlash(result, cookies);
  },
  rollback_stage: async ({ locals, request, cookies }) => {
    const userId = locals.user?.id ?? "0";
    const data = await request.formData();
    const requestId: string = data.get("requestId")?.toString() ?? "";
    const rollbackStageIndex: number = parseInt(
      data.get("inboxStageTypeIndex")?.toString() ?? "-1",
    );
    
    if (rollbackStageIndex < 0) {
      setFlash(
        {
          type: "error",
          message: "Error. Invalid stage was selected",
        },
        cookies,
      );
      return;
    }

    // Check if request still exists in pending
    // Needed in case button is spammed
    const requestExistsInInbox = await existsInInbox(userId, "recallable", {
      requestId,
      stageTypeIndex: rollbackStageIndex,
    });
    if (!requestExistsInInbox) {
      setFlash(
        {
          type: "error",
          message: "Error. Stage to recall not in pending",
        },
        cookies,
      );
      return;
    }

    // Get Request and its RequestType
    const { req: req, reqType: reqType, error: reqError } = await getRequestAndType(requestId);
    if (!req || !reqType) {
      setFlash(reqError, cookies);
      return;
    }

    const result = await rollbackStage(req, reqType, userId, rollbackStageIndex);
    setFlash(result, cookies);
  },
};

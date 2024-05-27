import type { PageServerLoad, Actions } from "./$types";
import * as db from "$lib/server/database";
import * as dbUtils from "$lib/server/dbUtils";
import { ObjectId } from "mongodb";

import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth";
import { sendInboxNotification } from "$lib/notifications";

import type { InboxStageData, UserInfo } from "./inboxTypes";
import {
  addToInbox,
  existsInInbox,
  getInbox,
  removeFromInbox,
} from "../../../lib/server/inboxUtils";
import {
  finishRequest,
  getRequestAndType,
  passRequest,
  reassign,
  rollbackStage,
} from "./stageHandling";

export const load: PageServerLoad = async ({ cookies, locals }) => {
  const sessionId = cookies.get(lucia.sessionCookieName);
  const userId = locals.user?.id ?? "-1";

  if (userId === "-1") {
    setFlash(
      { type: "error", message: "Something went wrong. Invalid userId" },
      cookies,
    );
    return fail(400);
  }

  const users = await getUsers();
  const userInbox: db.Inbox = await getInbox(userId);
  const requestTypes = await dbUtils.getRequestTypes();
  const latestRequestTypes = await dbUtils.getLatestRequestTypes();

  const reqAndStages = await getRequestsAndStages(
    userId,
    userInbox,
    requestTypes,
  );
  const requests = reqAndStages.requests;
  const activeStages = reqAndStages.activeStages;
  const pendingStages = reqAndStages.pendingStages;

  return {
    form: await superValidate(zod(formSchema)),
    userInfo: locals.user!,
    sessionId: sessionId!,
    latestRequestTypes: latestRequestTypes,
    relevantRequests: requests,
    activeStages: activeStages,
    pendingStages: pendingStages,
    users: users,
  };
};

const getUsers = async () => {
  const cursor = db.user.find();
  const users: { [_id: string]: UserInfo } = {};
  for await (const user of cursor) {
    users[user._id] = { name: user.name, profileUrl: user.profileUrl };
  }

  return users;
};

// get all requests that are relevant to user - either active or pending
// also removes requests that are misplaced current if it finds any
const getRequestsAndStages = async (
  userId: string,
  userInbox: db.Inbox,
  requestTypes: { [key: string]: db.RequestType },
) => {
  let activeStages: InboxStageData[] = [];
  let pendingStages: InboxStageData[] = [];

  let requests: { [key: string]: db.Request } = {};
  for (const stageIdentifier of userInbox.current) {
    const req = await db.request.findOne({ _id: stageIdentifier.requestId });
    if (!req) {
      await removeFromInbox(userId, "current", stageIdentifier);
      continue;
    }

    requests[stageIdentifier.requestId] = req;
    const requestType = requestTypes[req.requestTypeId];

    if (req.currentStage.handlerId !== userId) {
      await removeFromInbox(userId, "current", stageIdentifier);
    } else {
      addStage(stageIdentifier, req, requestType, activeStages, "active");
    }
  }

  for (const stageIdentifier of userInbox.recallable) {
    const req = await db.request.findOne({ _id: stageIdentifier.requestId });
    if (!req) {
      await removeFromInbox(userId, "recallable", stageIdentifier);
      continue;
    }

    requests[stageIdentifier.requestId] = req;
    const requestType = requestTypes[req.requestTypeId];
    addStage(stageIdentifier, req, requestType, pendingStages, "pending");
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
  inboxType: "active" | "pending",
) => {
  const stage = request.currentStage;

  listToAppendTo.push({
    requestTitle: requestType.title,
    stageTitle: requestType.stages[stage.stageTypeIndex].stageTitle,
    inboxStageTitle:
      requestType.stages[stageIdentifier.stageTypeIndex].stageTitle,
    dateSent: stage.dateStarted,
    requestId: stageIdentifier.requestId,
    handlerId: stage.handlerId,
    remarks: stage.remarks,
    prevHandlerId: stage.prevHandlerId,
    currentStageTypeIndex: stage.stageTypeIndex,
    inboxStageTypeIndex: stageIdentifier.stageTypeIndex,
    inboxType: inboxType,
    final: stage.stageTypeIndex == requestType.stages.length - 1,
    finished: stage.finished,
  });
};

import { setFlash } from "sveltekit-flash-message/server";

export const actions: Actions = {
  add_request: async (event) => {
    const { locals, cookies } = event;
    const userId = locals.user?.id ?? "-1";

    if (userId === "-1") {
      setFlash(
        { type: "error", message: "Something went wrong. Invalid userId" },
        cookies,
      );
      return fail(400);
    }

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
    const selectedRequestTypeIds = data.selectedReqTypeIds;
    const purpose = data.purpose;
    const remarks = data.remarks;

    const reqTypeIdCounts = JSON.parse(selectedRequestTypeIds);

    const currentStage: db.Stage = {
      stageTypeIndex: 0,
      handlerId: userId,
      prevHandlerId: "",
      finished: false,
      dateStarted: new Date(),
      dateFinished: new Date(0),
      remarks: "",
    };

    let successCount = 0;
    let failureCount = 0;

    for (const idCount of reqTypeIdCounts) {
      const reqType = await db.requestType.findOne({
        _id: idCount.id,
      });
      if (!reqType) {
        failureCount++;
        continue;
      }

      const nextHandlerId =
        reqType.stages.length >= 2 ? reqType.stages[1].defaultHandlerId : "";

      const req: db.Request = {
        _id: new ObjectId().toString(),
        requestTypeId: idCount.id,
        studentNumber: studentNumber,
        studentName: studentName,
        studentEmail: studentEmail,
        purpose: purpose,
        remarks: remarks,
        copies: idCount.count,
        isFinished: false,
        roomId: new ObjectId().toString(),
        currentStage: currentStage,
        history: [],
        nextHandlerId: nextHandlerId,
      };

      let insertionResult = await db.request.insertOne(req);
      if (!insertionResult.acknowledged) {
        failureCount++;
        continue;
      }

      await addToInbox(userId, "current", {
        requestId: req._id,
        stageTypeIndex: 0,
      });

      successCount++;
    }

    if (successCount == 0) {
      setFlash(
        { type: "error", message: "Failed to create requests" },
        cookies,
      );
    } else {
      let message = `Successfully created ${successCount} request${successCount > 1 ? "s" : ""}. `;
      if (failureCount > 0)
        message += `Failed to create ${failureCount} requests.`;
      setFlash({ type: "success", message: message }, cookies);
    }
  },
  finish_stage: async ({ request, locals, cookies }) => {
    const userId = locals.user?.id ?? "0";
    const sessionId = cookies.get(lucia.sessionCookieName)!;
    const data = await request.formData();
    const requestId: string = data.get("requestId")?.toString() ?? "";
    const nextHandlerId: string = data.get("nextHandlerId")?.toString() ?? "0";

    // Get Request and its RequestType
    const {
      req: req,
      reqType: reqType,
      error: reqError,
    } = await getRequestAndType(requestId);
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

    if (!onFinalStage) {
      const credentials = { sessionId, userId };
      await sendInboxNotification(
        {
          type: "NewStage",
          requestId,
          stageTypeIndex: req.currentStage.stageTypeIndex,
        },
        nextHandlerId,
        credentials,
      );

      result = await passRequest(req, reqType, nextHandlerId);
    } else {
      result = await finishRequest(req);
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
    const {
      req: req,
      reqType: reqType,
      error: reqError,
    } = await getRequestAndType(requestId);
    if (!req || !reqType) {
      setFlash(reqError, cookies);
      return;
    }

    const result = await rollbackStage(
      req,
      reqType,
      userId,
      rollbackStageIndex,
    );
    const credentials = {
      sessionId: cookies.get(lucia.sessionCookieName)!,
      userId: locals.user?.id!,
    };

    await sendInboxNotification(
      {
        type: "RolledBackStage",
        requestId,
        stageTypeIndex: rollbackStageIndex,
      },
      req.currentStage.prevHandlerId,
      credentials,
    );
    setFlash(result, cookies);
  },
  reassign_stage: async ({ locals, request, cookies }) => {
    const data = await request.formData();
    const requestId: string = data.get("requestId")?.toString() ?? "";
    const nextHandlerId: string = data.get("nextHandlerId")?.toString() ?? "";

    const req = await db.request.findOne({ _id: requestId });
    if (!req) {
      setFlash(
        { type: "error", message: "Error. Request not found in database." },
        cookies,
      );
      return;
    }

    const result = await reassign(req, nextHandlerId);
    if (result.type === "error") {
      setFlash(result, cookies);
      return;
    }

    const credentials = {
      sessionId: cookies.get(lucia.sessionCookieName)!,
      userId: locals.user?.id!,
    };
    await sendInboxNotification(
      {
        type: "ReassignedStage",
        requestId,
        stageTypeIndex: req.currentStage.stageTypeIndex,
      },
      nextHandlerId,
      credentials,
    );
    setFlash(result, cookies);
  },
};

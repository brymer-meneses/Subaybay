import type { Actions, PageServerLoad } from "./$types";
import * as db from "$lib/server/database";
import { fail, superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { setFlash } from "sveltekit-flash-message/server";
import { markRequestAsStale, reassign } from "../../inbox/stageHandling";
import { sendInboxNotification } from "$lib/notifications";
import { lucia } from "$lib/server/auth";
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  const requestId = event.params.requestId;
  let error = { error: false, message: "", requestId };

  const existing = await db.request.findOne({ _id: requestId });

  if (!existing) {
    setFlash({ type: "error", message: "Page Does Not Exist." }, event.cookies);
    error.message = "Unable to find a request with the specified ID.";
    error.error = true;
  }

  const storedData = await retrieveData(requestId);

  return {
    error: error,
    form: await superValidate(zod(formSchema)),
    userInfo: event.locals.user,
    request: storedData.request,
    requestType: storedData.requestType,
    users: storedData.users,
  };
};

const retrieveData = async (requestId: string) => {
  const cursor = db.user.find();
  const users: { [_id: string]: { name: string; profileUrl: string } } = {};

  for await (const user of cursor) {
    users[user._id] = { name: user.name, profileUrl: user.profileUrl };
  }

  const request = await db.request.findOne<db.Request>({ _id: requestId });
  if (!request) {
    error(400, "invalid request id")
  }

  const requestType = await db.requestType.findOne<db.RequestType>({
    _id: request.requestTypeId,
  });
  if (!requestType)
    error(400, "invalid request id")

  return {
    users,
    request,
    requestType,
  };
};

export const actions: Actions = {
  edit: async (event) => {
    const cookies = event.cookies;
    const requestId = event.params.requestId;

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
    const purpose = data.purpose;
    const remarks = data.remarks;
    const copies = data.copies;

    const request = await db.request.findOneAndUpdate(
      { _id: requestId },
      {
        $set: {
          studentName: studentName,
          studentEmail: studentEmail,
          studentNumber: studentNumber,
          purpose: purpose,
          remarks: remarks,
          copies: copies,
        },
      },
    );

    if (request) {
      setFlash({ type: "success", message: "Edited request" }, cookies);
    } else {
      setFlash({ type: "error", message: "Failed to update request" }, cookies);
    }
  },
  mark_stale: async ({ request, cookies }) => {
    const data = await request.formData();
    const requestId = data.get("requestId") as string;
    const requestInstance = (await db.request.findOne({
      _id: requestId,
    })) as db.Request;

    const req = await markRequestAsStale(requestInstance);
    setFlash({ type: req.type, message: req.message }, cookies);
  },
  reassign: async ({ request, locals, cookies, params }) => {
    const data = await request.formData();
    const requestId: string = params.requestId;
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

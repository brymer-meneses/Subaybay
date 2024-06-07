import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

import * as db from "$lib/server/database";
import { getLatestRequestTypes } from "$lib/server/dbUtils";
import { ObjectId } from "mongodb";
import type { UserData } from "./configClasses";
import { setFlash } from "sveltekit-flash-message/server";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  let cursor = db.user.find();
  let users: { [key: string]: UserData } = {};
  for await (const doc of cursor) {
    users[doc._id] = {
      id: doc._id,
      name: doc.name,
      profileUrl: doc.profileUrl,
    };
  }

  const requestTypes = await getLatestRequestTypes();

  return { userInfo: event.locals.user, users, requestTypes };
};

export const actions: Actions = {
  create: async (event) => {
    const { request, locals, cookies } = event;
    const form = await request.formData();

    const title = form.get("title")?.toString() ?? "";
    let stagesJSONStr = form.get("stageData")?.toString() ?? "";

    /* 
     * "Undefined" or any combination of cases might get accepted as a title 
     * so, i put .toLowerCase()
     * 
     * I also put .trim() to prevent submitting titles with only just whitespaces. 
     * ''.trim() is still '' haha
     */

    if (title.toLowerCase() == "undefined" || title.trim() == "") {
      setFlash({ type: "error", message: "Invalid Title" }, cookies);
      return fail(400);
    }

    // uses getLatestRequestTypes since it needs to also ignore deprecated
    const latestRequests = await getLatestRequestTypes();

    // I added .toLowerCase() so that "Certificate of enrollment" wont get accepted if "Certificate of Enrollment" already exists.
    const duplicate = latestRequests.find((requestType) => {
      return title.toLowerCase() === requestType.title.toLowerCase();
    });
    if (duplicate) {
      setFlash(
        {
          type: "error",
          message:
            "Error. A request type with that title already exists. Please rename.",
        },
        cookies,
      );
      return fail(400);
    }

    const stages: db.StageType[] = JSON.parse(stagesJSONStr);

    let allValid = true;
    for (const stage of stages) {
      if (stage.stageTitle === "") {
        allValid = false;
        break;
      }
    }

    if (!allValid) {
      setFlash(
        { type: "error", message: "Stage names may not be blank." },
        cookies,
      );
      return fail(400);
    }

    let newRequestType: db.RequestType = {
      _id: new ObjectId().toString(),
      title: title,
      stages: stages,
      deprecated: false,
      version: 1,
    };

    await db.requestType.insertOne(newRequestType);

    setFlash(
      { type: "success", message: "Success. New Request Type Created." },
      cookies,
    );
  },
};

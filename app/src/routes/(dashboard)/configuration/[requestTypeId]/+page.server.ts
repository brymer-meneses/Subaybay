import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";
import { UserData } from "../configClasses";
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

  const requestTypeId = event.params.requestTypeId;

  let requestType = await db.requestType.findOne({ _id: requestTypeId });
  if (!requestType) {
    requestType = {
      _id: "",
      title: "Request Type Does Not Exist",
      stages: [],
      version: -1,
    };

    setFlash(
      { type: "error", message: "Request Type not found" },
      event.cookies,
    );
  }

  return { userInfo: event.locals.user, users, requestType };
};

export const actions: Actions = {
  edit: async (event) => {
    const { request, locals, cookies } = event;
    const form = await request.formData();

    const requestTypeId = event.params.requestTypeId;
    const stagesJSONStr = form.get("stageData")?.toString() ?? "";

    let requestType = await db.requestType.findOne({ _id: requestTypeId });
    if (!requestType) {
      setFlash(
        { type: "error", message: "Error. Request Type not found" },
        cookies,
      );
      return fail(400);
    }

    const oldStages: db.StageType[] = requestType.stages;

    const newStages: db.StageType[] = JSON.parse(stagesJSONStr);
    let allValid = true;
    for (const stage of newStages) {
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

    let createNewVersion = false;

    // Create a new version if stages were renamed, added, or deleted
    if (oldStages.length != newStages.length) {
      createNewVersion = true;
    } else {
      for (let i = 0; i < newStages.length; i++) {
        if (oldStages[i].stageTitle !== newStages[i].stageTitle) {
          createNewVersion = true;
          break;
        }
      }
    }

    if (createNewVersion && await isUsedByAnyRequest(requestTypeId)) {
      const newVersion: db.RequestType = {
        _id: new ObjectId().toString(),
        title: requestType.title,
        version: requestType.version + 1,
        stages: newStages,
      };
      db.requestType.insertOne(newVersion);
    } else {
      db.requestType.updateOne(
        { _id: requestTypeId },
        { $set: { stages: newStages } },
      );
    }

    setFlash(
      { type: "error", message: "Successfully edited request." },
      cookies,
    );
  },
};

async function isUsedByAnyRequest(requestTypeId: string) {
  const first = await db.request.findOne({ requestTypeId: requestTypeId });
  return first ? true : false;
}

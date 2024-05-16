import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";
import { StageData, UserData } from "./configClasses";
import { setFlash } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async (event) => {
  let cursor = db.user.find();
  let allUsers: any = [];
  for await (const doc of cursor) {
    allUsers.push({ id: doc._id, name: doc.name, profileUrl: doc.profileUrl });
  }

  return { userInfo: event.locals.user, allUsers: allUsers };
};

export const actions: Actions = {
  create: async (event) => {
    const { request, locals, cookies } = event
    const form = await request.formData();

    const requestType = form.get("requestType")?.toString() ?? "";
    let stagesJSONStr = form.get("stageData")?.toString() ?? "";
    let usersJSONStr = form.get("users")?.toString() ?? "";

    if (requestType == "undefined" || requestType == "") {
      setFlash(
        { type: "error", message: "Invalid Title" },
        cookies,
      );
      return;
    }

    const duplicate = await db.requestType.findOne({ title: requestType });
    if (duplicate) {
      setFlash(
        { type: "error", message: "Error. A Request Type with that title already exists. Please rename." },
        cookies,
      );
      return;
    }

    let users: UserData[] = JSON.parse(usersJSONStr);
    const formStages: StageData[] = JSON.parse(stagesJSONStr);

    let allValid = true;
    const stages: db.StageType[] = [];
    for (const stage of formStages) {
      if (stage.stageName === "") {
        allValid = false;
        break;
      }
      stages.push({
        stageTitle: stage.stageName,
        defaultHandlerId: users[stage.handlerIndex].id
      })
    }

    if (!allValid) {
      setFlash(
        { type: "error", message: "Stage names may not be blank." },
        cookies,
      );
      return;
    }

    let newRequestType: db.RequestType = {
      _id: new ObjectId().toString(),
      title: requestType,
      stages: stages,
      version: 1,
    };

    await db.requestType.insertOne(newRequestType);
  },
};

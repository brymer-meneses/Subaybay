import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";
import { StageData, UserData } from "./configClasses";

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
    let data = await event.request.formData();

    let requestType = data.get("requestType")?.toString() ?? "";
    let stagesJSONStr = data.get("stageData")?.toString() ?? "";
    let usersJSONStr = data.get("users")?.toString() ?? "";

    let title = requestType.toString();
    let users: UserData[] = JSON.parse(usersJSONStr);
    const formStages: StageData[] = JSON.parse(stagesJSONStr);

    const stages: db.StageType[] = [];
    for (const stage of formStages) {
      stages.push({
        stageTitle: stage.stageName,
        defaultHandlerId: users[stage.handlerIndex].id
      })
    }

    //todo insert form validation

    let newRequestType: db.RequestType = {
      _id: new ObjectId().toString(),
      title: title,
      stages: stages,
    };

    await db.requestType.insertOne(newRequestType);
  },
};

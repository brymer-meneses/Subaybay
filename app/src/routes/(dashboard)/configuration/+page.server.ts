import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types"

import {
  type StageType,
  type RequestType,
  database,
  user,
} from "$lib/server/database";
import { ObjectId } from "mongodb";
import {
  SubstageData,
  UserData,
} from "./configClasses";

export const load: PageServerLoad = async (event) => {
  let cursor = user.find();
  let allUsers: any = [];
  for await (const doc of cursor) {
    allUsers.push({ id: doc._id, name: doc.name, profileUrl: doc.profileUrl });
  }

  return { userInfo: event.locals.user, allUsers: allUsers };
};

export const actions: Actions = {
  default: async (event) => {
    let data = await event.request.formData();

    let formRequestTypeEntry = data.get("requestType") ?? "";
    let formStagesEntry = data.get("stageData") ?? "";
    let formUsersEntry = data.get("users") ?? "";

    let title = formRequestTypeEntry.toString();
    let users: UserData[] = JSON.parse(formUsersEntry.toString());
    let stages: StageType[][] = [];

    if (formStagesEntry && formUsersEntry) {
      const formStages: SubstageData[][] = JSON.parse(
        formStagesEntry.toString(),
      );

      let stageIndex = 0;
      for (const stage of formStages) {
        stages.push([]);
        for (const substage of stage) {
          const stageType: StageType = {
            stageTitle: substage.stageName,
            defaultHandlerId: users[substage.handlerIndex].id,
          };

          stages[stageIndex].push(stageType);
        }
        stageIndex++;
      }
    }

    //todo insert form validation

    let newRequestType: RequestType = {
      _id: new ObjectId().toString(),
      title: title,
      stages: stages,
    };

    const requestTypes = database.collection<RequestType>("requestTypes");

    await requestTypes.insertOne(newRequestType);
  },
};

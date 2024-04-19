import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
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
} from "$lib/components/request-config/configClasses";

export const load: PageServerLoad = async (event) => {
  let cursor = user.find();
  let allUsers: any = [];
  for await (const doc of cursor) {
    allUsers.push({ id: doc._id, name: doc.name, profileUrl: doc.profileUrl });
  }

  return { userInfo: event.locals.user, allUsers: allUsers };
};

export const actions = {
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
            _id: new ObjectId().toString(),
            stageTitle: substage.stageName,
            defaultHandler: users[substage.handlerIndex].id,
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

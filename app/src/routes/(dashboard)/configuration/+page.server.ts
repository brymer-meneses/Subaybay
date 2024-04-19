import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { type StageType, type RequestType, database, user } from "$lib/server/database";
import { ObjectId } from "mongodb";
import { SubstageData } from "$lib/components/request-config/configClasses";

export const load: PageServerLoad = async (event) => {

  let cursor = user.find();
  let allUsers: any = [];
  for await (const doc of cursor) {
    allUsers.push({ id: doc._id, name: doc.name, profileUrl: doc.profileUrl })
  }

  return { userInfo: event.locals.user, allUsers: allUsers };
}

export const actions = {
  create: async (event) => {
    let data = await event.request.formData();
    console.log(data.get("stageData"));
    console.log(data.get("requestType"));

    let test = data.get("s0-0");

    console.log(test);
    
    let formRequestType = data.get("requestType");
    let formStages = data.get("stageData");

    let title = formRequestType ? formRequestType.toString() : "";
    let stages: StageType[][] = [];

    console.log(formStages);
    if (formStages) {
      // (<SubstageData[][]>(<unknown>formStages)).forEach((e, i) => {
      //   console.log(i + " " + e);
      // })
      // for (const stage of <SubstageData[][]>(<unknown>formStages)) {
      //   for (const substage of stage) {
      //     //todo convert to StageType 
      //     console.log(substage.stageName + " " + substage.handlerIndex);
      //   }
      // }
    }
    // let stages = formStages ? (StageType[][])

    //todo insert form validation

    let entry = {
      _id: new ObjectId().toString(),
      title: title,
      stages: stages
    }

    const requestTypes = database.collection<RequestType>("requestTypes");

    await requestTypes.insertOne(entry);
  }
}

import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { database, user, request, requestType, type User, type Request, type RequestType } from "$lib/server/database";
import type { RequestEvent } from "../$types";

export const load: PageServerLoad = async (event) => {
  
  // if (event.locals.user && !event.locals.user.isAdmin) {
  //   redirect(302, "/inbox");
  // }

  // NOTE: user cannot not be null here since this page won't be loaded if that's the case
  // unauthorized access

  const users: User[] = await user.find({}).toArray();
  const requests: Request[] = await request.find({}).toArray();
  const requestTypes: RequestType[] = await requestType.find({}).toArray();

  let finished: number = 0;
  let pending: number = 0;
  let stale: number = 0;

  for (const request of requests) {
    let request = requests[0]
    const reqType = requestTypes.find(e=> e._id === request.requestTypeId);
    const stages = reqType?.stages;
    console.log(stages)
    
    if (stages){
      const finalStageIndex = stages.length - 1;
      const currentStageIndex = request.currentStages[0].stageTypeIndex;
      if (currentStageIndex === finalStageIndex && request.isFinished){
        finished++;
      }  else if ((currentStageIndex < finalStageIndex) && !request.isFinished) {
        pending++;
      } else if ((currentStageIndex < finalStageIndex) && request.isFinished){
        stale++;
      }
    }
  }

  console.log(finished, pending, stale)

  // TODO count the finished, pending, and stale requests for each types, then just provide a summary.
  type RequestTypeInstancesCount = {
    reqType: string, 
    total: {
      finished: number, 
      pending: number, 
      stale: number
    }
  }
  let count: RequestTypeInstancesCount[]  = [
    {
      reqType: "coe", 
      total: {
        finished: 2, 
        pending: 3, 
        stale: 0
      }
    }
  ];

  const summary = [
    { type: "Finished", count: finished },
    { type: "Pending", count: pending },
    { type: "Stale", count: stale },
  ]
  const stats = {summary, count, requests, requestTypes};

  return { users, stats };
};

export const actions: Actions = {
  remove_user: async({request}) => {
    const data = await request.formData();
    const email:string = data.get("email") as string;

    if(!email){
      console.log("Null email.");
      return;
    }
    const users = database.collection<User>("users");
    await users.deleteOne({email});

    const res = await users.find({}).toArray()

    return { users: res };
  },

  remove_admin: async({request}) => {
    const data = await request.formData();
    const email:string = data.get("email") as string;

    if(!email){
      console.log("Null email.");
      return;
    }
    
    const users = database.collection<User>("users");
    await users.updateOne({email}, {$set: {isAdmin: false}});

    const res = await users.find({}).toArray()

    return { users: res };
  },

  add_admin: async({request}) => {
    const data = await request.formData();
    const email:string = data.get("email") as string;

    if(!email){
      console.log("Null email.");
      return;
    }

    const users = database.collection<User>("users");
    await users.updateOne({email}, {$set: {isAdmin: true}});

    const res = await users.find({}).toArray()

    return { users: res };
  },
}
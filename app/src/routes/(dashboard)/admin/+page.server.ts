import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import {
  database,
  user,
  request,
  requestType,
  type User,
  type Request,
  type RequestType,
  whitelistedEmail,
} from "$lib/server/database";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { setFlash } from "sveltekit-flash-message/server";


type RequestTypeInstancesCount = {
  reqType: string;
  reqTitle: string;
  total: {
    finished: number;
    pending: number;
    stale: number;
  };
};


/********************************************************
 *                                                      *
 *                                                      *
 *                                                      *
 *          NOW APPROACHING SPAGHETTI ZONE              *
 *                                                      *
 *                                                      *
 *                                                      *
 *******************************************************/  


export const load: PageServerLoad = async (event) => {
  if (event.locals.user && !event.locals.user.isAdmin) {
    redirect(302, "/inbox");
  }
  
  // NOTE: user cannot not be null here since this page won't be loaded if that's the case
  // unauthorized access
  
  const users: User[] = await user.find({}).toArray();
  const requests: Request[] = await request.find({}).toArray();
  const requestTypes: RequestType[] = await requestType.find({}).toArray();
  
  let count: RequestTypeInstancesCount[] = [];
    
  const today = new Date();
  let overview: {date: Date, value: number}[] = [];

  for (let i = 13; i >= 0; i--) {
    overview.push({date: subtractDays(today, i), value: 0});
  }

  let summary = [
    { type: "Finished", count: 0, countThisMonth: 0 },
    { type: "Pending", count: 0, countThisMonth: -1 },
    { type: "Stale", count: 0, countThisMonth: -1 },
  ];

  for (const reqType of requestTypes) {
    count.push({
      reqType: reqType._id,
      reqTitle: reqType.title,
      total: { finished: 0, pending: 0, stale: 0 },
    });
  }

  for (const request of requests) {
    const reqType = requestTypes.find((e) => e._id === request.requestTypeId);
    const stages = reqType?.stages;

    if (stages) {
      const finalStageIndex = stages.length - 1;
      const currentStageIndex = request.currentStage.stageTypeIndex;

      const foundIndex = count.findIndex(
        (x) => x.reqType === request.requestTypeId,
      );
      
      const currentStageDateFinished = new Date(
        request.currentStage.dateFinished,
      );

      if (currentStageIndex === finalStageIndex && request.isFinished) {
        count[foundIndex].total.finished++;
        summary[0].count++;
        
        const dateDiff = Math.floor((today.getTime() - currentStageDateFinished.getTime())/ (1000 * 3600 * 24));

        if (dateDiff < 14) {
          overview[overview.length - dateDiff - 1].value++;
        }

        if (isThisMonthAndYear(currentStageDateFinished)) {
          summary[0].countThisMonth++;
        }
      } else if (currentStageIndex < finalStageIndex && !request.isFinished) {
        count[foundIndex].total.pending++;
        summary[1].count++;
      } else if (currentStageIndex < finalStageIndex && request.isFinished) {
        count[foundIndex].total.stale++;
        summary[2].count++;
      }
    }
  }
  count.sort(compare);
  return { users, stats: { summary, count, requests, requestTypes, overview}, form: await superValidate(zod(formSchema)) };
};

function subtractDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
 }

function isThisMonthAndYear(date: Date) {
  const today = new Date();
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function compare(a: RequestTypeInstancesCount, b: RequestTypeInstancesCount) {
  let totalA = 0;
  let totalB = 0;

  for (const key in a.total) {
    const reqKey = key as keyof RequestTypeInstancesCount["total"];
    totalA += a.total[reqKey];
    totalB += b.total[reqKey];
  }

  return totalB - totalA;
}

export const actions: Actions = {
  add_user: async (event) => {
    const { request, cookies } = event;

    const form = await superValidate(event, zod(formSchema));
    if (!form.valid){
      return fail(400, {
        form,
      });
    }

    const data = form.data;
    const email = data.email;

    const existingEmail = await whitelistedEmail.findOne({email: email});

    if (existingEmail) {
      setFlash({type: "error", message: "User is already whitelisted."}, cookies);
      return;
    } else {
      await whitelistedEmail.insertOne({email});
      setFlash({ type: "success", message: "Added User" }, cookies);
    }
    
    return {
      form,
    }
  },
  remove_user: async ({ cookies,request }) => {
    const data = await request.formData();
    const email: string = data.get("email") as string;
    
    if (!email) {
      console.log("Null email.");
      return;
    }

    await user.deleteOne({ email });
    await whitelistedEmail.deleteOne({ email });
    
    const res = await user.find({}).toArray();
    setFlash({ type: "success", message: "User removed" }, cookies);
    
    return { users: res };
  },
  
  remove_admin: async ({ cookies, request }) => {
    const data = await request.formData();
    const email: string = data.get("email") as string;
    
    if (!email) {
      console.log("Null email.");
      return;
    }
    
    await user.updateOne({ email }, { $set: { isAdmin: false } });
    const staff = await user.findOne({email: email});
    
    const res = await user.find({}).toArray();
    setFlash({ type: "success", message: `${staff?.name} has been removed as admin.` }, cookies);
    
    return { users: res };
  },
  
  add_admin: async ({ cookies, request }) => {
    const data = await request.formData();
    const email: string = data.get("email") as string;
    
    if (!email) {
      console.log("Null email.");
      return;
    }
    
    await user.updateOne({ email }, { $set: { isAdmin: true } });
    const staff = await user.findOne({email: email});
    
    const res = await user.find({}).toArray();
    setFlash({ type: "success", message: `${staff?.name} is now an admin.` }, cookies);
    
    return { users: res };
  },
};

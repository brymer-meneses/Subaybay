import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import {
  database,
  user,
  request,
  requestType,
  type User,
  type Request,
  type RequestType,
} from "$lib/server/database";
import type { RequestEvent } from "../$types";

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
  // if (event.locals.user && !event.locals.user.isAdmin) {
  //   redirect(302, "/inbox");
  // }

  // NOTE: user cannot not be null here since this page won't be loaded if that's the case
  // unauthorized access

  const users: User[] = await user.find({}).toArray();
  const requests: Request[] = await request.find({}).toArray();
  const requestTypes: RequestType[] = await requestType.find({}).toArray();

  let count: RequestTypeInstancesCount[] = [];

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
      const currentStageIndex = request.currentStages[0].stageTypeIndex;

      const foundIndex = count.findIndex(
        (x) => x.reqType === request.requestTypeId,
      );
      const currentStageDateFinished = new Date(
        request.currentStages[0].dateFinished,
      );

      if (currentStageIndex === finalStageIndex && request.isFinished) {
        count[foundIndex].total.finished++;
        summary[0].count++;

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
  count.sort(compare); // reqtypes with 0 instances will be put at the end of the arr.

  return { users, stats: { summary, count, requests, requestTypes } };
};

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
  remove_user: async ({ request }) => {
    const data = await request.formData();
    const email: string = data.get("email") as string;

    if (!email) {
      console.log("Null email.");
      return;
    }
    const users = database.collection<User>("users");
    await users.deleteOne({ email });

    const res = await users.find({}).toArray();

    return { users: res };
  },

  remove_admin: async ({ request }) => {
    const data = await request.formData();
    const email: string = data.get("email") as string;

    if (!email) {
      console.log("Null email.");
      return;
    }

    const users = database.collection<User>("users");
    await users.updateOne({ email }, { $set: { isAdmin: false } });

    const res = await users.find({}).toArray();

    return { users: res };
  },

  add_admin: async ({ request }) => {
    const data = await request.formData();
    const email: string = data.get("email") as string;

    if (!email) {
      console.log("Null email.");
      return;
    }

    const users = database.collection<User>("users");
    await users.updateOne({ email }, { $set: { isAdmin: true } });

    const res = await users.find({}).toArray();

    return { users: res };
  },
};

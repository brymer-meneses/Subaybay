import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import {
  request,
  requestType,
  type Request,
  type RequestType,
} from "$lib/server/database";

type RequestTypeInstancesCount = {
  reqTitle: string;
  total: {
    finished: number;
    pending: number;
    stale: number;
  };
};

export const load: PageServerLoad = async (event) => {
  if (event.locals.user && !event.locals.user.isAdmin) {
    redirect(302, "/inbox");
  }

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
      reqTitle: reqType.title,
      total: { finished: 0, pending: 0, stale: 0 },
    });
  }
  count = Array.from(new Set(count)) as RequestTypeInstancesCount[]; //remove duplicates

  for (const request of requests) {
    const requestTypeTitle = requestTypes.find(
      (e) => request.requestTypeId === e._id,
    )?.title;
    const reqType = requestTypes.find((e) => e._id === request.requestTypeId);

    const stages = reqType?.stages;

    if (stages) {
      const finalStageIndex = stages.length - 1;
      const currentStageIndex = request.currentStage.stageTypeIndex;

      const foundIndex = count.findIndex(
        (x) => x.reqTitle === requestTypeTitle,
      );

      const currentStageDateFinished = new Date(
        request.currentStage.dateFinished,
      );
      const epochDate = new Date(0);

      if (
        currentStageIndex === finalStageIndex &&
        request.isFinished &&
        currentStageDateFinished.getTime() !== epochDate.getTime()
      ) {
        count[foundIndex].total.finished++;
        summary[0].count++;

        if (isThisMonthAndYear(currentStageDateFinished)) {
          summary[0].countThisMonth++;
        }
      } else if (currentStageIndex <= finalStageIndex && !request.isFinished) {
        count[foundIndex].total.pending++;
        summary[1].count++;
      } else if (currentStageIndex <= finalStageIndex && request.isFinished) {
        count[foundIndex].total.stale++;
        summary[2].count++;
      }
    }
  }
  count.sort(compare);
  /**
   * sum and count are needed for the overview of each request type
   * requests and requestTypes are needed for the actual data
   */
  return { stats: { summary, count, requests, requestTypes } };
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

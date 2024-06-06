import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import {
  user,
  request,
  requestType,
  type User,
  type Request,
  type RequestType,
} from "$lib/server/database";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user && !event.locals.user.isAdmin) {
    redirect(302, "/inbox");
  }

  const users: User[] = await user.find({}).toArray();
  const requests: Request[] = await request.find({}).toArray();
  const requestTypes: RequestType[] = await requestType.find({}).toArray();

  const today = new Date();
  let overview: { date: Date; value: number }[] = [];

  for (let i = 13; i >= 0; i--) {
    overview.push({ date: subtractDays(today, i), value: 0 });
  }

  let summary = [
    { type: "Finished", count: 0, countThisMonth: 0 },
    { type: "Pending", count: 0, countThisMonth: -1 },
    { type: "Stale", count: 0, countThisMonth: -1 },
  ];


  // TODO: Refactor this. Ugly code
  for (const request of requests) {
    const reqType = requestTypes.find((e) => e._id === request.requestTypeId);

    const stages = reqType?.stages;

    if (stages) {
      const finalStageIndex = stages.length - 1;
      const currentStageIndex = request.currentStage.stageTypeIndex;

      const currentStageDateFinished = new Date(
        request.currentStage.dateFinished,
      );

      if (
        currentStageIndex === finalStageIndex &&
        request.isFinished &&
        request.currentStage.finished
      ) {
        summary[0].count++;
        const dateDiff = Math.floor((today.getTime() - currentStageDateFinished.getTime()) / (1000 * 60 * 60 * 24));

        if (dateDiff < 14) {
          overview[overview.length-1 - dateDiff].value++;
        }

        if (isThisMonthAndYear(currentStageDateFinished)) {
          summary[0].countThisMonth++;
        }
      } else if (currentStageIndex <= finalStageIndex && !request.isFinished) {
        summary[1].count++;
      } else if (currentStageIndex <= finalStageIndex && request.isFinished) {
        summary[2].count++;
      }
    }
  }
  return { users, stats: { summary, overview } };
};

function subtractDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  result.setHours(0, 0, 0, 0); // Ensure time is set to midnight
  return result;
}


function isThisMonthAndYear(date: Date) {
  const today = new Date();
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

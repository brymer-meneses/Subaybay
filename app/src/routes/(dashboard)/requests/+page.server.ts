import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const allReq = await db.request.find().toArray();
  const activeRequests: db.Request[] = [];
  const archivedRequests: db.Request[] = [];
  const finishedRequests: db.Request[] = [];
  const staleRequests: db.Request[] = [];

  for (const request of allReq) {
    if (request.isFinished) archivedRequests.push(request);
    else activeRequests.push(request);
  }

  const epoch = new Date(0);
  
  for (const request of archivedRequests) {
    const currentStageDateFinished = new Date(request.currentStage.dateFinished);

    if (currentStageDateFinished.getTime() === epoch.getTime()) { // request's current stage date finished is still 1970-1-1 => discontinued
      staleRequests.push(request);
    } else {
      finishedRequests.push(request);
    }
  }

  return { userInfo: event.locals.user, activeRequests, finishedRequests, staleRequests };
};

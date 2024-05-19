import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const allReq = await db.request.find().toArray();
  const activeRequests: db.Request[] = [];
  const finishedRequests: db.Request[] = [];
  const staleRequests: db.Request[] = [];

  for (const request of allReq) {
    if (!request.isFinished) {
      activeRequests.push(request);
    } else if (request.currentStage.finished) { 
      finishedRequests.push(request);
    } else {
      staleRequests.push(request);
    }
  }
  return { userInfo: event.locals.user, activeRequests, finishedRequests, staleRequests };
};

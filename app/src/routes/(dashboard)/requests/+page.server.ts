import * as db from "$lib/server/database";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const allReq = await db.request.find().toArray();
  const activeRequests: db.Request[] = [];
  const finishedRequests: db.Request[] = [];
  const staleRequests: db.Request[] = [];
  const requestTypes: db.RequestType[] = await db.requestType.find({}).toArray();

  for (const request of allReq) {
    if (!request.isFinished) {
      activeRequests.push(request);
    } else if (request.currentStage.finished) {
      finishedRequests.push(request);
    } else {
      staleRequests.push(request);
    }
  }

  return {
    userInfo: event.locals.user,
    requestTypes,
    activeRequests,
    finishedRequests,
    staleRequests,
  };
};
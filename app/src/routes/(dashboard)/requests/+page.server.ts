import * as db from "$lib/server/database";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const allReq = await db.request.find().toArray();
  const activeRequests: db.Request[] = [];
  const finishedRequests: db.Request[] = [];
  const staleRequests: db.Request[] = [];
  const requestTypes: db.RequestType[] = await db.requestType
    .find({})
    .toArray();

  for (const request of allReq) {
    if (!request.isFinished) {
      activeRequests.push(request);
    } else {
      const stageTypeIndex = request.currentStage.stageTypeIndex;
      const requestType = requestTypes.find(
        (rt: db.RequestType) => rt._id === request.requestTypeId,
      );
      if (requestType) {
        const lastStageIndex = requestType?.stages.length - 1;
        if (
          stageTypeIndex <= lastStageIndex &&
          !request.currentStage.finished
        ) {
          staleRequests.push(request);
        } else {
          finishedRequests.push(request);
        }
      }
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

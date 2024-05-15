import * as db from "$lib/server/database";
import { ObjectId } from "mongodb";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const allReq = await db.request.find().toArray();
  const activeRequests: db.Request[] = [];
  const archivedRequests: db.Request[] = [];

  for (const request of allReq) {
    if (request.isFinished) archivedRequests.push(request);
    else activeRequests.push(request);
  }

  return { userInfo: event.locals.user, activeRequests, archivedRequests };
};

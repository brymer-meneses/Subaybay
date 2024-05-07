import type { PageServerLoad } from "./$types";
import * as db from "$lib/server/database";

export const load: PageServerLoad = async (event) => {
  const requestId = event.params.requestId;

  const storedData = await retrieveData(requestId);

  return {
    userInfo: event.locals.user,
    request: storedData.request,
    requestType: storedData.requestType,
    users: storedData.users,
  };
};

const retrieveData = async (requestId: string) => {
  const cursor = db.user.find();
  const users: { [_id: string]: { name: string; profileUrl: string } } = {};
  for await (const user of cursor) {
    users[user._id] = { name: user.name, profileUrl: user.profileUrl };
  }

  const request = await db.request.findOne({ _id: requestId });
  if (!request) return { users: null, request: null, requestType: null };

  const requestType = await db.requestType.findOne({ _id: request.requestTypeId });
  if (!requestType) return { users: null, request: request, requestType: null };

  return { users, request, requestType };
};

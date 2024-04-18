import type { PageServerLoad } from "./$types";
import { database } from "$lib/server/database";

export const load: PageServerLoad = async ({ cookies, locals }) => {
  const sessionId = cookies.get('auth_session');
  // const requests = await database.request.find({}).toArray();

  // DUMMY DATA FOR NOW
  let requests = []
  for (let i = 0; i < 100; i++) {
    requests.push({
      stageTitle: "HD and GMC forwarded to UR for signature",
      requestTitle: "Honorable Dismissal",
      dateSent: new Date(
        Math.floor(Math.random() * 10000000000000),
      ).toDateString(),
      requestId: Math.floor(Math.random() * 10000),
    });
  }

  return { userInfo: locals.user!, sessionId: sessionId!, requests };
}

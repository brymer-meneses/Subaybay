import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import * as db from "$lib/server/database";

export const load: PageServerLoad = async (event) => {

  if (!event.locals.user) {
    redirect(302, "/auth/login");
  }

  const sessionId = event.cookies.get('auth_session');
  // const requests = await db.request.find({}).toArray();

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

  return { userInfo: event.locals.user!, sessionId: sessionId!, requests };
}

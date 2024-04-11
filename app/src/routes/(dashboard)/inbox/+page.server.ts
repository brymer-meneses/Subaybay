import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {

  if (!event.locals.user) {
    redirect(302, "/auth/login");
  }


  const sessionId = event.cookies.get('auth_session');
  return { userInfo: event.locals.user!, sessionId: sessionId! };
}

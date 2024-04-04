import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const sessionId = event.cookies.get('auth_session');
  return { userInfo: event.locals.user, sessionId };
}

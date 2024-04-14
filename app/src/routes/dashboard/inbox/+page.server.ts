import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {

  if (!event.locals.user) {
    redirect(302, "/auth/login");
  }

  const sessionId = event.cookies.get('auth_session');
  const user = { userInfo: event.locals.user!, sessionId: sessionId! }

  // Reactive search bar and results: get data here
  const search: string = 'TODO later';
  return {user, search};
}

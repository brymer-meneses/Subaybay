import type { LayoutServerLoad } from "./$types";
import { lucia } from "$lib/server/auth";

export const load: LayoutServerLoad = async (event) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  // need to put this here since sidebar is in the +layout.svelte in dashboard and
  // it depends on this
  return { userInfo: event.locals.user!, sessionId: sessionId! };
};

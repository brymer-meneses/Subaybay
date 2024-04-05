import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    redirect(302, "/auth/login");
  }

  return { userInfo: event.locals.user };
}

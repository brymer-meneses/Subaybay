import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    redirect(302, "/auth/login");
  };

  // unauthorized access
  if (!event.locals.user.isAdmin) {
    redirect(302, "/");
  };

  return { userInfo: event.locals.user };
}

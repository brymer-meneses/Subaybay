import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {

  if (!event.locals.user) {
    redirect(302, "/auth/login");
  }

  //
  // if (event.locals.user && !event.locals.user.isAdmin) {
  //   redirect(302, "/");
  // }

  // NOTE: user cannot not be null here since this page won't be loaded if that's the case
  // unauthorized access
}

import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  // NOTE: user cannot not be null here since this page won't be loaded if that's the case
  // unauthorized access
  if (!event.locals.user!.isAdmin) {
    redirect(302, "/");
  };
}

import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { database, type User } from "$lib/server/database";

export const load: PageServerLoad = async (event) => {
  
  // if (event.locals.user && !event.locals.user.isAdmin) {
  //   redirect(302, "/inbox");
  // }

  // NOTE: user cannot not be null here since this page won't be loaded if that's the case
  // unauthorized access

  const users = await database
    .collection<User>("users")
    .find({})
    .toArray();

  return { users };
};

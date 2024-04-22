import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { database, type User } from "$lib/server/database";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async (event) => {
  //
  // if (event.locals.user && !event.locals.user.isAdmin) {
  //   redirect(302, "/");
  // }

  // NOTE: user cannot not be null here since this page won't be loaded if that's the case
  // unauthorized access

  // idk whats with _id
  const users = await database
    .collection<User>("users")
    .find({}, { projection: { _id: 0 } })
    .toArray();

  return { users};
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    return {
      form,
    };
  },
};
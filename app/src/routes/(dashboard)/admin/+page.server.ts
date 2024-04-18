import type { PageServerLoad } from "./$types";
import { database, type User } from "$lib/server/database";


export const load: PageServerLoad = async (event) => {


  //
  // if (event.locals.user && !event.locals.user.isAdmin) {
  //   redirect(302, "/");
  // }

  // NOTE: user cannot not be null here since this page won't be loaded if that's the case
  // unauthorized access

  // idk whats with _id
  const users = await database.collection<User>("users").find({},{projection: { _id:0 }}).toArray();

  return {users};
}

import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { database, type User } from "$lib/server/database";
import type { RequestEvent } from "../$types";

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

export const actions: Actions = {
  update: async ({request}) => {
    let data = await request.formData();
    let selectedUsers: User[] = [];
    
    data.getAll('selectedUser').forEach( (u: any) => {
      selectedUsers.push(JSON.parse(u));
    })
    
    const users = database.collection<User>("users");
    for (const u of selectedUsers) {
      try {
        await users.updateOne({email: u.email}, {$set: {isAdmin: true}});
      } catch (error) {
        console.error("Failed to update user", error);
      }
    }

    return { users: await users.find({}).toArray()};
  }
}
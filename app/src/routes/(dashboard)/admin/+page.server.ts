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
  remove_user: async({request}) => {
    const data = await request.formData();
    const email:string = data.get("email") as string;
    console.log(email)

    if(!email){
      console.log("Null email.");
      return;
    }
    const users = database.collection<User>("users");
    await users.deleteOne({email});

    const res = await users.find({}).toArray()

    return { users: res };
  },

  remove_admin: async({request}) => {
    const data = await request.formData();
    const email:string = data.get("email") as string;
    console.log(email)

    if(!email){
      console.log("Null email.");
      return;
    }
    
    const users = database.collection<User>("users");
    await users.updateOne({email}, {$set: {isAdmin: false}});

    const res = await users.find({}).toArray()

    return { users: res };
  },

  add_admin: async({request}) => {
    const data = await request.formData();
    const email:string = data.get("email") as string;
    console.log(email)

    if(!email){
      console.log("Null email.");
      return;
    }

    const users = database.collection<User>("users");
    await users.updateOne({email}, {$set: {isAdmin: true}});

    const res = await users.find({}).toArray()

    return { users: res };
  },
}
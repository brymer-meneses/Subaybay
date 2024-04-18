import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { user } from "$lib/server/database";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    redirect(302, "/auth/login");
  }

  let cursor = user.find();
  let allUsers: any = [];
  for await (const doc of cursor) {
    allUsers.push({email : doc.email, name : doc.name, imgSrc : doc.profileUrl})
  }

  return { userInfo: event.locals.user, allUsers: allUsers };
}

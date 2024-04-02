import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    redirect(302, "/login");
  };

  const { name, email, imageUrl } = event.locals.user;
  console.log(imageUrl)
  return { name, email, imageUrl };
}

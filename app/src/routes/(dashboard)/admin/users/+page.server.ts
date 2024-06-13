import type { PageServerLoad, Actions } from "./$types";
import { redirect } from "@sveltejs/kit";
import { user, permittedEmail, type User } from "$lib/server/database";
import { setFlash } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user && !event.locals.user.isAdmin) {
    redirect(302, "/inbox");
  }

  const users: User[] = await user.find({}).toArray();
  return { users, currentUser: event.locals.user };
};

export const actions: Actions = {
  remove_user: async ({ cookies, request, locals }) => {
    const data = await request.formData();
    const email: string = data.get("email") as string;

    if (!email) {
      console.log("Null email.");
      return;
    }

    if (email === locals.user?.email) {
      setFlash(
        { type: "error", message: "You cannot remove privileges to yourself." },
        cookies,
      );
      return;
    }

    const staff = await user.findOne({ email });

    if (staff) {
      await user.deleteOne({ email });
      setFlash({ type: "success", message: `${email} removed` }, cookies);
    }

    const res1 = await user.find({}).toArray();
    const res2 = await permittedEmail
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return { users: res1, emails: res2 };
  },

  remove_admin: async ({ cookies, request, locals }) => {
    const data = await request.formData();
    const email: string = data.get("email") as string;

    if (!email) {
      console.log("Null email.");
      return;
    }

    if (email === locals.user?.email) {
      setFlash(
        { type: "error", message: "You cannot remove yourself." },
        cookies,
      );
      return;
    }

    await user.updateOne({ email }, { $set: { isAdmin: false } });
    const staff = await user.findOne({ email: email });

    const res = await user.find({}).toArray();
    setFlash(
      { type: "success", message: `${staff?.name} has been removed as admin.` },
      cookies,
    );

    return { users: res };
  },

  add_admin: async ({ cookies, request }) => {
    const data = await request.formData();
    const email: string = data.get("email") as string;

    if (!email) {
      console.log("Null email.");
      return;
    }

    await user.updateOne({ email }, { $set: { isAdmin: true } });
    const staff = await user.findOne({ email: email });

    const res = await user.find({}).toArray();
    setFlash(
      { type: "success", message: `${staff?.name} is now an admin.` },
      cookies,
    );

    return { users: res };
  },
};

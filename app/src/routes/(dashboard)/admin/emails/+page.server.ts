import type { PageServerLoad, Actions } from "./$types";
import { redirect } from "@sveltejs/kit";
import {
  user,
  permittedEmail,
  type PermittedEmail,
} from "$lib/server/database";
import { setFlash } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user && !event.locals.user.isAdmin) {
    redirect(302, "/inbox");
  }

  const permittedEmails: PermittedEmail[] = await permittedEmail
    .find({}, { projection: { _id: 0 } })
    .toArray();
  return { permittedEmails };
};

export const actions: Actions = {
  add_user: async ({ request, cookies }) => {
    const data = await request.formData();
    const email: string = data.get("email") as string;

    if (!email) {
      console.log("Null email.");
      setFlash({ type: "error", message: `Email cannot be empty.` }, cookies);
      return;
    }

    const existingEmail = await permittedEmail.findOne(
      { email },
      { projection: { _id: 0 } },
    );
    const existingUser = await user.findOne(
      { email },
      { projection: { _id: 0 } },
    );

    if (!existingEmail && !existingUser) {
      await permittedEmail.insertOne({ email, dateAdded: new Date() });
      setFlash(
        { type: "success", message: `${email} successfully added.` },
        cookies,
      );
    } else {
      setFlash(
        { type: "error", message: `${email} already has access.` },
        cookies,
      );
      return;
    }

    const permittedEmails = await permittedEmail
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return { permittedEmails };
  },

  remove: async ({ cookies, request }) => {
    const data = await request.formData();
    const email: string = data.get("email") as string;

    if (!email) {
      console.log("Null email.");
      return;
    }

    const staff = await permittedEmail.findOne({ email });

    if (staff) {
      await permittedEmail.deleteOne({ email });
      setFlash({ type: "success", message: `${email} removed` }, cookies);
    }

    const res = await permittedEmail
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return { permittedEmails: res };
  },
};

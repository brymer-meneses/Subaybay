import { redirect } from "sveltekit-flash-message/server";
import { lucia } from "$lib/server/auth";
import { session } from "$lib/server/database";

import { type RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent): Promise<Response> {
  if (!event.locals.session) {
    redirect(302, "/");
  }

  await lucia.invalidateSession(event.locals.session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  event.cookies.set(sessionCookie.name, sessionCookie.value, {
    path: ".",
    ...sessionCookie.attributes,
  });

  redirect(
    "/",
    {
      type: "success",
      message: "Logged out successfully",
    },
    event.cookies,
  );
}

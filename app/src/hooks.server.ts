// Reference:
//  https://lucia-auth.com/getting-started/sveltekit
import { lucia } from "$lib/server/auth";
import { type Handle } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { client } from "$lib/server/database";

export const handle: Handle = async ({ event, resolve }) => {
  // NOTE:
  // Top level await on $lib/server/database runs the code on build-time somehow
  // tis is bade since the database may not be started on build time.
  // This is a no-op, if the client is already connected
  await client.connect();

  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
  } else {
    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      // sveltekit types deviates from the de-facto standard
      // you can use 'as any' too
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes,
      });
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes,
      });
    }

    event.locals.user = user;
    event.locals.session = session;
  }

  const protectedPaths = ["inbox", "configuration", "admin", "requests"];

  if (!event.locals.user) {
    for (const path of protectedPaths) {
      if (event.url.pathname.split("/").includes(path)) {
        redirect(
          "/",
          {
            type: "error",
            message: "Authentication Error",
            args: { description: "Login to continue" },
          },
          event.cookies,
        );
      }
    }
  }

  return resolve(event);
};

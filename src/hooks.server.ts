import { redirect, type Handle } from "@sveltejs/kit";
import { verifyIdToken } from "$lib/auth/verifyIdToken";

const protectedPaths = ["dashboard"];

export const handle: Handle = async ({ event, resolve }) => {
  const idToken = event.cookies.get("idToken");
  const isIdTokenValid = await verifyIdToken(idToken);

  if (event.url.pathname === "/") {
    if (isIdTokenValid) {
      redirect(303, "/dashboard");
    }
  }

  for (const path in protectedPaths) {
    if (event.url.pathname.includes(path)) {
      if (isIdTokenValid) redirect(303, "/");
    }
  }

  const response = await resolve(event);
  return response;
};

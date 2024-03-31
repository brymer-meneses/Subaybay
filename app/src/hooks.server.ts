import { redirect, type Handle } from "@sveltejs/kit";
import { verifyIdToken } from "$lib/auth/verifyIdToken";

const protectedPaths = ["dashboard"];

export const handle: Handle = async ({ event, resolve }) => {
  const idToken = event.cookies.get("idToken");
  const verificationResult = await verifyIdToken(idToken);

  console.log(verificationResult.message)

  if (event.url.pathname === "/") {
    if (verificationResult.success) {
      redirect(303, "/dashboard");
    }
  }

  for (const path in protectedPaths) {
    if (event.url.pathname.includes(path)) {
      if (!verificationResult.success) redirect(303, "/");
    }
  }

  const response = await resolve(event);
  return response;
};

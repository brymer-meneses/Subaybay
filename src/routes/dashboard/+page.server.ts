import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { verifyIdToken } from "$lib/auth/verifyIdToken";
import * as jose from "jose";

export const load: PageServerLoad = ({ cookies }) => {

  const idToken = cookies.get("idToken");

  if (!idToken) {
    redirect(302, "/");
  }

  if (!verifyIdToken(idToken)) {
    redirect(302, "/");
  }

  const payload = jose.decodeJwt(idToken);
  return { ...payload }
}

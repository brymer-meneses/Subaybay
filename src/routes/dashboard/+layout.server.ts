import { redirect } from "@sveltejs/kit";
import { verifyIdToken } from "$lib/auth/verifyIdToken";
import type { LayoutServerLoad } from "./$types";
import * as jose from "jose";

export const load: LayoutServerLoad = ({ cookies }) => {
  const idToken = cookies.get("idToken");
  if (!idToken) return {};

  if (!verifyIdToken(idToken)) {
    redirect(302, "/");
  }

  const payload = jose.decodeJwt(idToken!);
  return { picture: payload.picture, name: payload.name };
};

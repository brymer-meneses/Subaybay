import { generateCodeVerifier, generateState } from "arctic";
import { google } from "$lib/server/auth";
import { redirect, type RequestEvent, type RequestHandler } from "@sveltejs/kit";

import { dev } from "$app/environment";

export const GET: RequestHandler = async (event: RequestEvent) => {

  if (event.locals.user) {
    redirect(302, "/inbox");
  }


  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email", "openid"]
  });

  const tenMinutesInSeconds = 60 * 10;

  // store state verifier as cookie
  event.cookies.set("state", state, {
    secure: !dev,
    path: "/",
    httpOnly: true,
    maxAge: tenMinutesInSeconds
  });

  // store code verifier as cookie
  event.cookies.set("code_verifier", codeVerifier, {
    secure: !dev,
    path: "/",
    httpOnly: true,
    maxAge: tenMinutesInSeconds
  });

  redirect(302, url.toString());
}


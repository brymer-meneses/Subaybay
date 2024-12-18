import { Google, generateCodeVerifier, generateState } from "arctic";
import { env } from "$env/dynamic/private";
import {
  redirect,
  type RequestEvent,
  type RequestHandler,
} from "@sveltejs/kit";

export const GET: RequestHandler = async (event: RequestEvent) => {
  const secure = env.USES_HTTPS == "true";
  const protocol = !secure ? "http" : "https";
  const callbackUrl = `${protocol}://${event.url.host}/auth/login/callback`;

  const google = new Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    callbackUrl,
  );
  if (event.locals.user) {
    redirect(302, "/inbox");
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const authorizationUrl = await google.createAuthorizationURL(
    state,
    codeVerifier,
    {
      scopes: ["profile", "email", "openid"],
    },
  );

  const tenMinutesInSeconds = 60 * 10;

  // store state verifier as cookie
  event.cookies.set("state", state, {
    secure: secure,
    path: "/",
    maxAge: tenMinutesInSeconds,
  });

  // store code verifier as cookie
  event.cookies.set("code_verifier", codeVerifier, {
    secure: secure,
    path: "/",
    maxAge: tenMinutesInSeconds,
  });

  redirect(302, authorizationUrl.toString());
};

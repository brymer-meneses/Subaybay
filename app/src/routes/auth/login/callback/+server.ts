import { Google, OAuth2RequestError } from "arctic";
import type { RequestHandler } from "@sveltejs/kit";

import { redirect } from "sveltekit-flash-message/server";

import { env } from "$env/dynamic/private";
import { lucia } from "$lib/server/auth";
import { user, permittedEmail } from "$lib/server/database";

interface GoogleAccount {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: string;
  locale: string;
}

export const GET: RequestHandler = async ({ cookies, url }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies.get("state");
  const storedCodeVerifier = cookies.get("code_verifier");

  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    redirect("/", { type: "error", message: "Authentication Error" }, cookies);
  }

  const protocol = env.USES_HTTPS == "false" ? "http" : "https";
  const callbackUrl = `${protocol}://${url.host}/auth/login/callback`;
  const google = new Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    callbackUrl,
  );

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );
    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const account: GoogleAccount = await response.json();
    const googleId = account.sub;
    const existingAccount = await user.findOne({ _id: googleId });

    if ((await user.countDocuments()) == 0) {
      await user.insertOne({
        _id: account.sub,
        name: account.name,
        email: account.email,
        profileUrl: account.picture,
        isAdmin: true,
      });
    } else if (!existingAccount) {
      const isWhitelisted = await permittedEmail.findOne({
        email: account.email,
      });

      // Dont forget to Uncomment these:
      if (!isWhitelisted) {
        redirect(
          "/",
          { type: "error", message: "User not whitelisted." },
          cookies,
        );
      } else {
        await permittedEmail.deleteOne({ email: account.email }); // Remove the email in the permitted emails collection
      }

      await user.insertOne({
        _id: account.sub,
        name: account.name,
        email: account.email,
        profileUrl: account.picture,
        isAdmin: false,
      });
    }

    const session = await lucia.createSession(googleId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    const secure = env.USES_HTTPS == "true";

    cookies.set(sessionCookie.name, sessionCookie.value, {
      secure: secure,
      path: ".",
      ...sessionCookie.attributes,
    });
  } catch (e: any) {
    const errorMessage: string = e.message ?? "Authentication Error";

    if (e instanceof OAuth2RequestError) {
      redirect(
        "/",
        { type: "error", message: "Authentication Error" },
        cookies,
      );
    }

    redirect("/", { type: "error", message: errorMessage }, cookies);
  }

  redirect(302, "/inbox");
};

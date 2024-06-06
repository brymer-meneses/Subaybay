import { OAuth2RequestError } from "arctic";
import type { RequestHandler } from "@sveltejs/kit";

import { redirect } from "sveltekit-flash-message/server";

import { google, lucia } from "$lib/server/auth";
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
    
    if (!existingAccount) {  
      const isWhitelisted = await permittedEmail.findOne({
        email: account.email,
      });

      // Uncomment this para sa testing
      // if (!isWhitelisted) {
      //   throw new Error(`${account.email} is not waitlisted.` );
      // } else {
      //   await permittedEmail.deleteOne( {email: account.email }); // Remove the email in the permitted emails collection
      // }

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

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      redirect(
        "/",
        { type: "error", message: "Authentication Error" },
        cookies,
      );
    }

    const errorMessage: string = e.message ?? "Authentication Error";
    console.log(errorMessage);
    redirect("/", { type: "error", message: errorMessage }, cookies);
  }

  redirect(302, "/inbox");
};

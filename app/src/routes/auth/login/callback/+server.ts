import { OAuth2RequestError } from "arctic";
import { type RequestEvent } from "@sveltejs/kit";
import { google, lucia } from "$lib/server/auth";
import { user } from "$lib/server/database";
import { generateId } from "lucia";

interface GoogleAccount {
  sub: string,
  name: string,
  given_name: string,
  family_name: string,
  picture: string,
  email: string,
  email_verified: string,
  locale: string,
}

export async function GET(event: RequestEvent): Promise<Response> {

  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");

  const storedState = event.cookies.get("state");
  const storedCodeVerifier = event.cookies.get("code_verifier");

  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });

    const account: GoogleAccount = await response.json();
    const googleId = account.sub;

    const existingAccount = await user.findOne({ "_id": googleId });
    if (!existingAccount) {
      await user.insertOne({
        _id: account.sub,
        name: account.name,
        email: account.email,
        profileUrl: account.picture,
        isAdmin: false,
      })
    }

    const session = await lucia.createSession(googleId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });


    return new Response(null, {
      status: 302,
      headers: {
        Location: "/inbox"
      }
    });

  } catch (e) {
    console.error(e);

    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/"
        }
      });
    }
    return new Response(null, {
      status: 500
    });
  }


}

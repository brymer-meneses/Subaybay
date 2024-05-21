import { Lucia, TimeSpan } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Google } from "arctic";

import { dev } from "$app/environment";
import { session, user, type User } from "./database";
import { env } from "$env/dynamic/private"

const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET ?? "";
const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID ?? "";

export const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:5173/auth/login/callback",
);

const SESSION_COOKIE_NAME = "auth_session";

const adapter = new MongodbAdapter(session, user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, "d"),
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
    name: SESSION_COOKIE_NAME,
  },

  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      email: attributes.email,
      profileUrl: attributes.profileUrl,
      isAdmin: attributes.isAdmin,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}

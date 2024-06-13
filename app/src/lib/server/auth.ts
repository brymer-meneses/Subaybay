import { Lucia, TimeSpan } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Google } from "arctic";

import { dev } from "$app/environment";
import { session, user, type User } from "./database";
import { env } from "$env/dynamic/private";


const prefix = env.USES_HTTPS === "true" ? "https" : "http";
const url = env.APP_URL;

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,

  `${url}/auth/login/callback`,
);

const adapter = new MongodbAdapter(session, user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, "d"),
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
    name: "auth_session",
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

import { Lucia } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Google } from "arctic";

import { dev } from "$app/environment";
import { GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID } from "$env/static/private";
import { session, user, type User } from "./database";

export const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:5173/auth/login/callback",
);

const adapter = new MongodbAdapter(session, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
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

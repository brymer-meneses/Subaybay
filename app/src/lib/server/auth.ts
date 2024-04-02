import { Lucia } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Google } from "arctic";

import { dev } from "$app/environment"
import { GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID } from "$env/static/private";
import { session, user, type User } from "./database";

export const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:5173/login/callback",
)

const adapter = new MongodbAdapter(session, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  },

  getUserAttributes: (attributes) => {
    return {
      id: attributes._id,
      name: attributes.name,
      email: attributes.email,
      imageUrl: attributes.imageUrl,
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}


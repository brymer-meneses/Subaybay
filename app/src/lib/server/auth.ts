import { Lucia, TimeSpan } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";

import { session, user, type User } from "./database";
import { env } from "$env/dynamic/private";

const adapter = new MongodbAdapter(session, user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, "d"),
  sessionCookie: {
    attributes: {
      secure: env.USES_HTTPS == "true",
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

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { client } from "./client";
import { sessions, users } from "./schema";

export const adapter = new DrizzlePostgreSQLAdapter(client, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: true,
    },
  },
  getUserAttributes(attributes) {
    return {
      id: attributes.id,
      userId: attributes.userId,
      name: attributes.name,
      isAdmin: attributes.isAdmin,
      isBanned: attributes.isBanned,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: typeof users.$inferSelect;
  }
}

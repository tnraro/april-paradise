import type { users } from "$lib/data/schema";
import type { Session, User } from "lucia";
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: User | null;
      session: Session | null;
      auth: {
        signUp(info: typeof users.$inferInsert): Promise<void>;
        signIn(
          info: Pick<typeof users.$inferSelect, "userId", "password">,
        ): Promise<boolean>;
        signOut(): Promise<void>;
      };
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

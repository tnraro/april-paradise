import type { Client, ServerRequestAuth } from "@edgedb/auth-sveltekit/server";
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      auth: ServerRequestAuth;
      client: Client;
      currentUser: {
        id: string;
        isAdmin: boolean;
        isBanned: boolean;
      } | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

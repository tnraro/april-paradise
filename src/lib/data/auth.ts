import { env } from "$env/dynamic/private";
import { type AuthOptions } from "@edgedb/auth-sveltekit/client";

export const options: AuthOptions = {
  baseUrl: env.BASE_URL,
  authRoutesPath: "auth",
};

import { options } from "$lib/data/auth";
import { client } from "$lib/data/client";
import serverAuth, { type AuthRouteHandlers } from "@edgedb/auth-sveltekit/server";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const { createServerRequestAuth, createAuthRouteHook } = serverAuth(client, options);

const createServerAuthClient: Handle = ({ event, resolve }) => {
  event.locals.auth = createServerRequestAuth(event);
  return resolve(event);
};
const authRouteHandlers: AuthRouteHandlers = {
  async onOAuthCallback(params) {
    console.log("oauthcallback", params);
    throw 53;
  },
  async onBuiltinUICallback(params) {
    console.log("builtinuicallback", params);
    throw 53;
  },
  onSignout() {
    redirect(303, "/");
  },
};

export const handle = sequence(createServerAuthClient, createAuthRouteHook(authRouteHandlers));

import { options } from "$lib/data/auth";
import { client } from "$lib/data/client";
import serverAuth, {
  type AuthRouteHandlers,
} from "@edgedb/auth-sveltekit/server";
import { type Handle, redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const { createServerRequestAuth, createAuthRouteHook } = serverAuth(
  client,
  options,
);

const logger: Handle = ({ event, resolve }) => {
  console.info(event.request.method, event.request.url);
  return resolve(event);
};
const createServerAuthClient: Handle = ({ event, resolve }) => {
  event.locals.auth = createServerRequestAuth(event);
  return resolve(event);
};
const authRouteHandlers: AuthRouteHandlers = {
  onSignout() {
    redirect(303, "/");
  },
};

export const handle = sequence(
  logger,
  createServerAuthClient,
  createAuthRouteHook(authRouteHandlers),
);

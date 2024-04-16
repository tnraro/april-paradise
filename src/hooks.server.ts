import { options } from "$lib/data/auth";
import { client } from "$lib/data/client";
import { getCurrentUser } from "$lib/data/query/get-current-user.query";
import { initData } from "$lib/data/sheets/sheets";
import { measureFnTime } from "$lib/shared/util/measure-time";
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
const createServerAuthClient: Handle = async ({ event, resolve }) => {
  event.locals.auth = createServerRequestAuth(event);
  const client = event.locals.auth.session.client;

  const currentUserId = await getCurrentUser(client);

  event.locals.client = client.withGlobals({
    currentUserId,
  });
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

await initData(client);

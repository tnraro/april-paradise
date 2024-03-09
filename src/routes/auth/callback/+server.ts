import { createHost, currentUserExists } from "$edgedb/queries";
import { NAME } from "$lib/shared/schema/auth.js";
import { error, redirect } from "@sveltejs/kit";

export const GET = async ({ locals, url }) => {
  const session = locals.auth.session;
  if (!(await session.isSignedIn())) {
    error(401);
  }
  if (await currentUserExists(session.client)) {
    error(409);
  }
  const name = NAME.parse(url.searchParams.get("name"));

  await createHost(session.client, {
    name,
  });

  redirect(303, "/");
};

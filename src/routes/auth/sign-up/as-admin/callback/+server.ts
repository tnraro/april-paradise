import { createAdmin, currentUserExists } from "$edgedb/queries";
import { NAME } from "$lib/shared/schema/auth.js";
import { error, redirect } from "@sveltejs/kit";
import { EdgeDBError } from "edgedb";

export const GET = async ({ locals, url }) => {
  const session = locals.auth.session;
  if (!(await session.isSignedIn())) {
    error(401);
  }
  if (await currentUserExists(session.client)) {
    error(409);
  }
  const name = NAME.parse(url.searchParams.get("name"));

  try {
    await createAdmin(session.client, {
      name,
    });
  } catch (error) {
    if (error instanceof EdgeDBError) {
      if (error.name === "ConstraintViolationError") {
        await createAdmin(session.client, {
          name: name + Math.random(),
        });
      }
    }
  }

  redirect(303, "/");
};

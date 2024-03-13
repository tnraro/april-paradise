import { NAMEz } from "$lib/shared/schema/auth.js";
import { error, redirect } from "@sveltejs/kit";
import { EdgeDBError } from "edgedb";
import { get } from "./get.query";

export const GET = async ({ locals, url }) => {
  const session = locals.auth.session;
  if (!(await session.isSignedIn())) {
    error(401);
  }
  const name = NAMEz.parse(url.searchParams.get("name"));

  try {
    await get(session.client, {
      name,
    });
  } catch (e) {
    if (e instanceof EdgeDBError) {
      if (e.name === "ConstraintViolationError") {
        error(409);
      }
    }
  }

  redirect(303, "/");
};

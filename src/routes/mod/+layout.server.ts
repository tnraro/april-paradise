import { getCurrentHostProfile } from "$edgedb/queries.js";
import { error } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const session = locals.auth.session;
  if (!(await session.isSignedIn())) {
    return error(401, "권한이 없습니다");
  }

  const host = await getCurrentHostProfile(session.client);

  if (host == null) {
    return error(401, "권한이 없습니다");
  }

  return {
    host,
  };
};

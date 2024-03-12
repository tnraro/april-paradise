import { getRunnerByName } from "$edgedb/queries.js";
import { error } from "@sveltejs/kit";

export const load = async ({ locals, depends, params }) => {
  depends("admin:runners");

  const session = locals.auth.session;
  const runner = await getRunnerByName(session.client, {
    name: params.name,
  });

  if (runner == null) {
    error(404);
  }

  return {
    runner,
  };
};

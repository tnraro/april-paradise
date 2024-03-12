import { getAllRunners } from "$edgedb/queries.js";

export const load = async ({ locals, depends, params }) => {
  depends("admin:runners");

  const session = locals.auth.session;
  const runners = await getAllRunners(session.client);

  return {
    runners: runners.map((runner) => ({
      ...runner,
      selected: params.name === runner.name,
    })),
    selected: params.name,
  };
};

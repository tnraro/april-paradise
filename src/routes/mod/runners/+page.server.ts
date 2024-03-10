import { getAllRunners } from "$edgedb/queries.js";

export const load = async ({ locals, depends }) => {
  depends("mod:runners");

  const session = locals.auth.session;
  const runners = await getAllRunners(session.client);

  return {
    runners: runners.map((runner) => ({
      id: runner.id,
      twitterId: runner.twitter_id,
      isBanned: runner.is_banned,
      name: runner.name,
      chips: runner.chips,
      tokens: runner.tokens,
    })),
  };
};

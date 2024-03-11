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
    runner: {
      id: runner.id,
      name: runner.name,
      memo: runner.memo,
      isBanned: runner.is_banned,
      isActive: runner.is_active,
      chips: runner.chips,
      tokens: runner.tokens,
      twitterId: runner.twitter_id,
      hasIdentity: runner.has_identity,
      penalties: runner.penalties.map((penalty) => ({
        id: penalty.id,
        reason: penalty.reason,
        isBanned: penalty.is_banned,
        isWarning: penalty.is_warning,
      })),
    },
  };
};

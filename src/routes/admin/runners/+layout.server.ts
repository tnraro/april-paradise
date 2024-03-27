import { wrapRunnerData, wrapRunners } from "$lib/data/sheets/utils";
import { layout } from "./layout.query";

export const load = async ({ locals, depends, params }) => {
  depends("admin:runners");

  const session = locals.auth.session;
  const runners = await wrapRunners(layout(session.client));

  return {
    runners: runners.map((runner) => ({
      ...runner,
      selected: params.key === runner.key,
    })),
    selected: params.key,
  };
};

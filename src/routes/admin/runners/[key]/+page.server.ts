import { wrapRunnerData } from "$lib/data/sheets/utils";
import { error } from "@sveltejs/kit";
import { page } from "./page.query";

export const load = async ({ locals, depends, params }) => {
  depends("admin:runners");

  const session = locals.auth.session;
  const runner = await wrapRunnerData(
    page(session.client, {
      key: params.key,
    }),
  );

  if (runner == null) {
    error(404);
  }

  return {
    runner,
  };
};

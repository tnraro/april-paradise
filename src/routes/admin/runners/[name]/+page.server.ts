import { error } from "@sveltejs/kit";
import { page } from "./page.query";

export const load = async ({ locals, depends, params }) => {
  depends("admin:runners");

  const session = locals.auth.session;
  const runner = await page(session.client, {
    name: params.name,
  });

  if (runner == null) {
    error(404);
  }

  return {
    runner,
  };
};

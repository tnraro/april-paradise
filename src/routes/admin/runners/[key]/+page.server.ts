import { wrapUser } from "$lib/data/sheets/utils";
import { error } from "@sveltejs/kit";
import { page } from "./page.query";

export const load = async ({ locals, depends, params }) => {
  depends("admin:runners");

  const session = locals.auth.session;
  const user = await wrapUser(
    page(session.client, {
      key: params.key,
    }),
  );

  if (user == null) {
    error(404);
  }

  return {
    user,
  };
};

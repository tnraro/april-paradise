import { wrapUser } from "$lib/data/sheets/utils";
import { error, redirect } from "@sveltejs/kit";
import { page } from "./page.query";

export const load = async ({ locals, depends, params }) => {
  depends("admin:runners");

  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  if (!locals.currentUser.isAdmin) {
    error(404);
  }
  const user = await wrapUser(
    page(locals.client, {
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

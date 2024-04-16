import { wrapRunners } from "$lib/data/sheets/utils";
import { error, redirect } from "@sveltejs/kit";
import { page } from "./page.query";

export const load = async ({ locals, depends }) => {
  depends("admin:runners");
  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  if (!locals.currentUser.isAdmin) {
    error(404);
  }
  const runners = await wrapRunners(page(locals.client));
  return {
    runners,
  };
};

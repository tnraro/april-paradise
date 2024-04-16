import { error, redirect } from "@sveltejs/kit";
import { page } from "./page.query.js";

export const load = async ({ locals }) => {
  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  const user = await page(locals.client);
  if (user == null) {
    error(404);
  }
  return {
    user,
  };
};

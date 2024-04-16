import { error, redirect } from "@sveltejs/kit";
import { page } from "./page.query";

export const load = async ({ locals, params }) => {
  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  const mail = await page(locals.client, {
    id: params.id,
  });

  if (mail == null) {
    error(404);
  }

  return {
    mail,
  };
};

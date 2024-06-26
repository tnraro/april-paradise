import { redirect } from "@sveltejs/kit";
import { layout } from "./layout.query.js";

export const load = async ({ locals }) => {
  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  const mails = await layout(locals.client);

  return {
    mails,
  };
};

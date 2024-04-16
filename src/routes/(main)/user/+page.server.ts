import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }
};

import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }
};

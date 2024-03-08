import { redirect } from "@sveltejs/kit";

export const GET = async ({ locals }) => {
  await locals.auth.signout();
  redirect(303, "/");
};

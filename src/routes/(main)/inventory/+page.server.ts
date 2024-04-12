import { error } from "@sveltejs/kit";
import { page } from "./page.query.js";

export const load = async ({ locals }) => {
  const user = await page(locals.client);
  if (user == null) {
    error(404);
  }
  return {
    user,
  };
};

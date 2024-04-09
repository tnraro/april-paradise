import { error } from "@sveltejs/kit";
import { page } from "./page.query";

export const load = async ({ locals, params }) => {
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

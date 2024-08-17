import { client } from "$lib/data/client.js";
import { getInventory } from "$lib/data/query/get-inventory";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  return {
    user: {
      inventory: await getInventory(client, locals.user.id),
    },
  };
};

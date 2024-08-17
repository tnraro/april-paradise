import { getItemData } from "$lib/data/sheets/sheets";
import { error, redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  if (!locals.user.isAdmin) {
    error(404);
  }
  const itemData = await getItemData();

  return {
    admin: locals.user,
    itemData,
  };
};

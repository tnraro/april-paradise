import { getItemData } from "$lib/data/sheets/sheets";
import { error, redirect } from "@sveltejs/kit";
import { layout } from "./layout.query";

export const load = async ({ locals }) => {
  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  if (!locals.currentUser.isAdmin) {
    error(404);
  }
  const admin = await layout(locals.client);
  if (admin == null) {
    return error(401, "권한이 없습니다");
  }
  const itemData = await getItemData();

  return {
    admin,
    itemData,
  };
};

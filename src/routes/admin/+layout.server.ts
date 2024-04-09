import { getItemData } from "$lib/data/sheets/sheets";
import { error } from "@sveltejs/kit";
import { layout } from "./layout.query";

export const load = async ({ locals }) => {
  const session = locals.auth.session;
  const admin = await layout(session.client);
  if (admin == null) {
    return error(401, "권한이 없습니다");
  }
  const itemData = await getItemData();

  return {
    admin,
    itemData,
  };
};

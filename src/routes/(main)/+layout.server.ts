import { getItemData, getScheduleData } from "$lib/data/sheets/sheets.js";
import { wrapUser } from "$lib/data/sheets/utils.js";
import { redirect } from "@sveltejs/kit";
import { layout } from "./layout.query.js";

export const load = async ({ locals, depends }) => {
  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }

  const user = await layout(locals.client);
  const itemData = await getItemData();
  const scheduleData = await getScheduleData();

  depends("header");

  return {
    user: await wrapUser(user),
    itemData,
    scheduleData,
  };
};

import { getItemData, getScheduleData } from "$lib/data/sheets/sheets.js";
import { wrapUser } from "$lib/data/sheets/utils.js";
import { layout } from "./layout.query.js";

export const load = async ({ locals, depends }) => {
  const session = locals.auth.session;
  const user = await layout(session.client);
  const itemData = await getItemData();
  const scheduleData = await getScheduleData();

  depends("header");

  return {
    user: await wrapUser(user),
    itemData,
    scheduleData,
  };
};

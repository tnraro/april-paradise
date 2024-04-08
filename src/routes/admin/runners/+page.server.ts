import { getItemData } from "$lib/data/sheets/sheets";
import { wrapRunners } from "$lib/data/sheets/utils";
import { page } from "./page.query";

export const load = async ({ locals, depends }) => {
  depends("admin:runners");
  const session = locals.auth.session;
  const runners = await wrapRunners(page(session.client));
  const items = await getItemData();
  return {
    runners,
    items,
  };
};

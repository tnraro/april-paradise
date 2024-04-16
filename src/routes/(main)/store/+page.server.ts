import { getStoreData } from "$lib/data/sheets/sheets";
import { redirect } from "@sveltejs/kit";
import { page } from "./page.query";

export const load = async ({ locals }) => {
  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  const storeData = await getStoreData();
  const items = await page(locals.client, {
    items: [
      "roulette-result-6",
      ...storeData.filter((x) => x.stock).map((x) => x.key),
    ],
  });

  return {
    storeData,
    inventory: items.reduce(
      (o, item) => {
        o[item.key] = item.quantity;
        return o;
      },
      {} as Record<string, number>,
    ),
  };
};

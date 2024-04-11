import { getStoreData } from "$lib/data/sheets/sheets";
import { page } from "./page.query";

export const load = async ({ locals }) => {
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

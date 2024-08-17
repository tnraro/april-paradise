import { getStoreData } from "$lib/data/sheets/sheets";
import { getInventory } from "$lib/ui/store/get-inventory";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  const storeData = await getStoreData();
  const inventory = await getInventory(
    locals.user.id,
    new Set([
      "roulette-result-6",
      ...storeData.filter((x) => x.stock).map((x) => x.key),
    ]),
  );

  return {
    storeData,
    inventory,
  };
};

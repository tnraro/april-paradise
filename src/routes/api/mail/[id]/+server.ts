import { route } from "$lib/api/server";
import { addItem } from "$lib/data/item/add-item.query";
import { addChips } from "$lib/data/query/add-chips.query";
import { addTokens } from "$lib/data/query/add-tokens.query";
import { getItemData } from "$lib/data/sheets/sheets";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { get } from "./get.query";
import { put } from "./put.query";

export type GET = typeof GET;
export const GET = route("get", async ({ locals, params }: RequestEvent) => {
  if (locals.currentUser == null || locals.currentUser.isBanned) error(401);
  const mail = await get(locals.client, {
    id: params.id,
  });

  return {
    mail,
  };
});

export type PUT = typeof PUT;
export const PUT = route("put", async ({ locals, params }: RequestEvent) => {
  if (locals.currentUser == null || locals.currentUser.isBanned) error(401);
  return await locals.client.transaction(async (tx) => {
    const itemData = await getItemData();

    const items = new Map(itemData.map((x) => [x.key, x]));

    const rewards = await put(tx, {
      id: params.id,
    });

    if (rewards == null) {
      return {};
    }

    for (const reward of rewards.split(",")) {
      const [key, _quantity] = reward.split(":");
      const quantity = Number(_quantity);

      if (key === "chip") {
        await addChips(tx, {
          chips: quantity,
        });
      } else if (key === "token") {
        await addTokens(tx, {
          tokens: quantity,
        });
      } else {
        const item = items.get(key);
        if (item == null) throw new Error(`no item: ${key}`);
        await addItem(tx, {
          key: item.key,
          category: item.category,
          quantity: quantity,
        });
      }
    }

    return {};
  });
});

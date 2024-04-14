import { route } from "$lib/api/server";
import { addItem } from "$lib/data/item/add-item.query";
import { addChips } from "$lib/data/query/add-chips.query";
import { addTokens } from "$lib/data/query/add-tokens.query";
import { getCurrentUser } from "$lib/data/query/get-current-user.query";
import { getItemData } from "$lib/data/sheets/sheets";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { get } from "./get.query";
import { put } from "./put.query";

export type GET = typeof GET;
export const GET = route("get", async (e: RequestEvent) => {
  const mail = await get(e.locals.client, {
    id: e.params.id,
  });

  return {
    mail,
  };
});

export type PUT = typeof PUT;
export const PUT = route("put", async (e: RequestEvent) => {
  return await e.locals.client.transaction(async (tx) => {
    const itemData = await getItemData();

    const items = new Map(itemData.map((x) => [x.key, x]));

    const currentUser = await getCurrentUser(tx);

    if (currentUser == null) error(401);

    const rewards = await put(tx, {
      id: e.params.id,
      recipient: currentUser,
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
          user: currentUser,
        });
      } else if (key === "token") {
        await addTokens(tx, {
          tokens: quantity,
          user: currentUser,
        });
      } else {
        const item = items.get(key);
        if (item == null) throw new Error(`no item: ${key}`);
        await addItem(tx, {
          key: item.key,
          category: item.category,
          quantity: quantity,
          owner: currentUser,
        });
      }
    }

    return {};
  });
});

import { route } from "$lib/api/server";
import { addItem } from "$lib/data/item/add-item.query";
import { addChipsByCurrentUser } from "$lib/data/query/add-chips-by-current-user.query";
import { addTokensByCurrentUser } from "$lib/data/query/add-tokens-by-current-user.query";
import { getStoreData } from "$lib/data/sheets/sheets";
import { z } from "zod";
import type { RequestEvent } from "./$types";

export type POST = typeof POST;
export const POST = route(
  "post",
  async ({ locals }: RequestEvent, items) => {
    return await locals.client.transaction(async (tx) => {
      const storeData = await getStoreData();
      const storeMap = new Map(storeData.map((item) => [item.key, item]));

      const config = items.reduce(
        (o, item) => {
          const storeData = storeMap.get(item.key);
          if (storeData == null) return o;
          o.items.push({
            key: item.key,
            quantity: item.quantity,
            category: storeData.category,
          });
          if (storeData.price.type === "chips") {
            o.chips += storeData.price.quantity * item.quantity;
          } else if (storeData.price.type === "tokens") {
            o.tokens += storeData.price.quantity * item.quantity;
          }
          return o;
        },
        {
          items: [] as { key: string; quantity: number; category: string }[],
          chips: 0,
          tokens: 0,
        },
      );
      if (config.chips > 0) {
        await addChipsByCurrentUser(tx, {
          chips: -config.chips,
        });
      }
      if (config.tokens > 0) {
        await addTokensByCurrentUser(tx, {
          tokens: -config.tokens,
        });
      }
      for (const item of config.items) {
        await addItem(tx, item);
      }

      return {};
    });
  },
  {
    body: z
      .array(
        z.object({
          key: z.string().min(1),
          quantity: z.number().min(1),
        }),
      )
      .min(1),
  },
);

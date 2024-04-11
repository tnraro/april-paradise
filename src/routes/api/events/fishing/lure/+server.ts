import { route } from "$lib/api/server";
import { addLureItem } from "$lib/data/item/add-lure-item";
import { addChipsByCurrentUser } from "$lib/data/query/add-chips-by-current-user.query";
import { addTokensByCurrentUser } from "$lib/data/query/add-tokens-by-current-user.query";
import { getLureData } from "$lib/data/sheets/sheets";
import { lures } from "$lib/shared/config/lures";
import { error } from "@sveltejs/kit";
import { ConstraintViolationError } from "edgedb";
import { z } from "zod";
import type { RequestEvent } from "./$types";

export type POST = typeof POST;
export const POST = route(
  "post",
  async ({ locals }: RequestEvent, body) => {
    const lureData = await getLureData();
    const data = new Map(lureData.map((x) => [x.key, x]));
    try {
      await locals.client.transaction(async (tx) => {
        for (const key of lures) {
          const quantity = body[key];
          if (quantity == null) continue;
          const lureData = data.get(key);
          if (lureData == null) continue;
          if (lureData.price.type === "chips") {
            await addChipsByCurrentUser(tx, {
              chips: -lureData.price.quantity * quantity,
            });
          } else if (lureData.price.type === "tokens") {
            await addTokensByCurrentUser(tx, {
              tokens: -lureData.price.quantity * quantity,
            });
          }
          await addLureItem(tx, {
            key,
            quantity,
          });
        }
      });
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        if (e.message.includes("chips")) {
          error(400, "칩이 부족합니다");
        }
        if (e.message.includes("tokens")) {
          error(400, "토큰이 부족합니다");
        }
      }
      throw e;
    }
    return {};
  },
  {
    body: z.object({
      "까만 콩 지렁이": z.number().optional(),
      "토깽이 떡밥": z.number().optional(),
      "사우루숭 벌레 유충": z.number().optional(),
    }),
  },
);

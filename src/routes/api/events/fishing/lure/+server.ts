import { route } from "$lib/api/server";
import { client } from "$lib/data/client";
import { addLureItem } from "$lib/data/item/add-lure-item";
import { addChips } from "$lib/data/query/add-chips";
import { addTokens } from "$lib/data/query/add-tokens";
import { getLureData } from "$lib/data/sheets/sheets";
import { lures } from "$lib/shared/config/lures";
import { error } from "@sveltejs/kit";
import pkg from "pg";
import { z } from "zod";
import type { RequestEvent } from "./$types";

const { DatabaseError } = pkg;

export type POST = typeof POST;
export const POST = route(
  "post",
  async ({ locals }: RequestEvent, body) => {
    const user = locals.user;
    if (user == null || user.isBanned) error(401);
    const lureData = await getLureData();
    const data = new Map(lureData.map((x) => [x.key, x]));
    try {
      await client.transaction(async (tx) => {
        for (const key of lures) {
          const quantity = body[key];
          if (quantity == null) continue;
          const lureData = data.get(key);
          if (lureData == null) continue;
          if (lureData.price.type === "chips") {
            await addChips(tx, user.id, -lureData.price.quantity * quantity);
          } else if (lureData.price.type === "tokens") {
            await addTokens(tx, user.id, -lureData.price.quantity * quantity);
          }
          await addLureItem(tx, user.id, key, quantity);
        }
      });
    } catch (e) {
      if (e instanceof DatabaseError) {
        if (e.constraint === "chips_should_be_positive") {
          error(400, "칩이 부족합니다");
        }
        if (e.constraint === "tokens_should_be_positive") {
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

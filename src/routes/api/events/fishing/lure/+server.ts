import { route } from "$lib/api/server";
import { addChipsByCurrentUser } from "$lib/data/query/add-chips-by-current-user.query";
import { addTokensByCurrentUser } from "$lib/data/query/add-tokens-by-current-user.query";
import { addResource } from "$lib/data/resources/add-resource.query";
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
    const lure = lureData.find((lure) => lure.key === body.lure);
    if (lure == null) error(400, "무언가 잘못되었습니다");
    try {
      await locals.client.transaction(async (tx) => {
        switch (lure.price.type) {
          case "chips": {
            await addChipsByCurrentUser(tx, {
              chips: -lure.price.quantity,
            });
            break;
          }
          case "tokens": {
            await addTokensByCurrentUser(tx, {
              tokens: -lure.price.quantity,
            });
            break;
          }
        }
        await addResource(tx, {
          key: body.lure,
          value: 1,
        });
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
  },
  {
    body: z.object({
      lure: z.enum(lures),
    }),
  },
);

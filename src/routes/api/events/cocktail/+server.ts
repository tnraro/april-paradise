import { route } from "$lib/api/server";
import { client } from "$lib/data/client";
import { addIngredientItem } from "$lib/data/item/add-ingredient-item";
import { addMiscItem } from "$lib/data/item/add-misc-item";
import { addResource } from "$lib/data/resources/add-resource";
import { getResource } from "$lib/data/resources/get-resource";
import { getCocktailIngredientData } from "$lib/data/sheets/sheets";
import { pick } from "$lib/shared/random/pick";
import { josa2 } from "$lib/shared/util/josa";
import { getCocktailTriggerN } from "$lib/ui/cocktail/config";
import { error } from "@sveltejs/kit";
import { z } from "zod";
import type { RequestEvent } from "./$types";

export type POST = typeof POST;
export const POST = route(
  "post",
  async ({ locals }: RequestEvent, body) => {
    const user = locals.user;
    if (user == null || user.isBanned) error(401);
    return await client.transaction(async (tx) => {
      const key = `cocktail-place-${body.key}`;
      const key2 = `cocktail-${body.type}`;
      const rev = body.type === "탐색" ? "조사" : "탐색";
      const key3 = `cocktail-${rev}`;
      const N = getCocktailTriggerN(body.type);
      const n2 = await getResource(tx, user.id, key2);
      if (n2 >= N) error(400, "횟수가 모두 소진되었습니다");
      const n = await getResource(tx, user.id, key);
      if (n > 0) error(400, "이미 다녀온 장소입니다");
      const n3 = await getResource(tx, user.id, key3);
      if (n3 > 0) error(400, `이미 ${josa2(rev, "을", "를")} 고르셨습니다`);
      await addResource(tx, user.id, key, 1);
      await addResource(tx, user.id, key2, 1);
      if (body.type === "탐색") {
        const cocktailData = await getCocktailIngredientData();
        const result = pick(cocktailData);
        console.info(result.name, result.key);
        if (result.key.startsWith("ingredient-")) {
          await addIngredientItem(tx, user.id, result.key, 1);
        } else if (result.key.startsWith("misc-")) {
          await addMiscItem(tx, user.id, result.key, 1);
        } else {
          return {
            result: null,
          };
        }
        return {
          result: {
            key: result.key,
            name: result.name,
          },
        };
      }
      return {};
    });
  },
  {
    body: z.object({
      type: z.enum(["탐색", "조사"]),
      key: z.string(),
    }),
  },
);

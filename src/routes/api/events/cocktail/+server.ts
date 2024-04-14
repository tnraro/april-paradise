import { route } from "$lib/api/server";
import { addItem } from "$lib/data/item/add-item.query";
import { getCurrentUser } from "$lib/data/query/get-current-user.query";
import { addResource } from "$lib/data/resources/add-resource.query";
import { getResource } from "$lib/data/resources/get-resource.query";
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
    return await locals.client.transaction(async (tx) => {
      const key = `cocktail-place-${body.key}`;
      const key2 = `cocktail-${body.type}`;
      const rev = body.type === "탐색" ? "조사" : "탐색";
      const key3 = `cocktail-${rev}`;
      const N = getCocktailTriggerN(body.type);
      const currentUser = await getCurrentUser(tx);
      if (currentUser == null) error(401);
      const n2 = await getResource(tx, { key: key2, owner: currentUser });
      if (n2 >= N) error(400, "횟수가 모두 소진되었습니다");
      const n = await getResource(tx, { key, owner: currentUser });
      if (n > 0) error(400, "이미 다녀온 장소입니다");
      const n3 = await getResource(tx, { key: key3, owner: currentUser });
      if (n3 > 0) error(400, `이미 ${josa2(rev, "을", "를")} 고르셨습니다`);
      await addResource(tx, {
        key,
        value: 1,
        owner: currentUser,
      });
      await addResource(tx, {
        key: key2,
        value: 1,
        owner: currentUser,
      });
      if (body.type === "탐색") {
        const cocktailData = await getCocktailIngredientData();
        const result = pick(cocktailData);
        console.info(result.name, result.key);
        if (result.key.startsWith("ingredient-")) {
          await addItem(tx, {
            key: result.key,
            category: "ingredient",
            quantity: 1,
            owner: currentUser,
          });
        } else if (result.key.startsWith("misc-")) {
          await addItem(tx, {
            key: result.key,
            category: "misc",
            quantity: 1,
            owner: currentUser,
          });
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

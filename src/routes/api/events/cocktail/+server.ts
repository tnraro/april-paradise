import { route } from "$lib/api/server";
import { addResource } from "$lib/data/resources/add-resource.query";
import { getResource } from "$lib/data/resources/get-resource.query";
import { josa2 } from "$lib/shared/util/josa";
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
      const N = body.type === "탐색" ? 5 : 3;
      const n = await getResource(tx, { key });
      if (n > 0) error(400, "이미 다녀온 장소입니다");
      const n2 = await getResource(tx, { key: key2 });
      if (n2 > N) error(400, "횟수가 모두 소진되었습니다");
      const n3 = await getResource(tx, { key: key3 });
      if (n3 > 0) error(400, `이미 ${josa2(rev, "을", "를")} 고르셨습니다`);
      await addResource(tx, {
        key,
        value: 1,
      });
      await addResource(tx, {
        key: key2,
        value: 1,
      });
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

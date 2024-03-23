import { route } from "$lib/api/server";
import { getFishingData } from "$lib/data/sheets/sheets";
import { pick } from "$lib/shared/random/pick";
import { z } from "zod";
import type { RequestEvent } from "./$types";

export type POST = typeof POST;
export const POST = route(
  "post",
  async (e: RequestEvent, body) => {
    const client = e.locals.auth.session.client;
    return await client.transaction(async (tx) => {
      const data = await getFishingData();
      const fishes = data.filter((x) => x.lure === body.lure);
      const result = pick(fishes);
      console.info(body.lure, result.name);
      // TODO: insert into inventory
      return {
        result: {
          key: result.key,
          name: result.name,
          catchphrase: result.catchphrase,
          grade: result.grade,
          hp: result.hp,
          power: result.power,
          rampancy: result.rampancy,
          endurance: result.endurance,
        },
      };
    });
  },
  {
    body: z.object({
      lure: z.enum(["까만 콩 지렁이", "토깽이 떡밥", "사우루숭 벌레 유충"]),
    }),
  },
);

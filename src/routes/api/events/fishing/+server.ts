import { createCipheriv, createDecipheriv, scryptSync } from "node:crypto";
import { env } from "$env/dynamic/private";
import { route } from "$lib/api/server";
import { addFishItem } from "$lib/data/item/add-fish-item.query";
import { addGarbageItem } from "$lib/data/item/add-garbage-item.query";
import { getFishingData } from "$lib/data/sheets/sheets";
import { pick } from "$lib/shared/random/pick";
import { z } from "zod";
import type { RequestEvent } from "./$types";

const KEY = scryptSync(env.KEY, "안녕하세요소금입니다소금소금", 16);

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
      const id = crypto.randomUUID();
      const key = result.key;
      const cipher = createCipheriv("aes-128-gcm", KEY, env.IV);
      const next =
        cipher.update(JSON.stringify({ id, key }), "utf8", "base64url") +
        cipher.final("base64url");

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
          next,
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

export type PUT = typeof PUT;
export const PUT = route(
  "put",
  async (e: RequestEvent, body) => {
    const decipher = createDecipheriv("aes-128-gcm", KEY, env.IV);
    const fish: { key: string } = JSON.parse(
      decipher.update(body.next, "base64url", "utf8"),
    );
    if (fish.key.startsWith("losing-")) {
      addGarbageItem(e.locals.client, { key: fish.key });
    } else {
      addFishItem(e.locals.client, { key: fish.key });
    }
  },
  {
    body: z.object({
      next: z.string(),
    }),
  },
);

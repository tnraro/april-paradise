import { env } from "$env/dynamic/private";
import { route } from "$lib/api/server";
import { onCaughtFish } from "$lib/data/achievement/achievement";
import { addAchievements } from "$lib/data/achievement/add-achievements";
import { client } from "$lib/data/client";
import { addFishItem } from "$lib/data/item/add-fish-item";
import { addGarbageItem } from "$lib/data/item/add-garbage-item";
import { addLureItem } from "$lib/data/item/add-lure-item";
import { addChips } from "$lib/data/query/add-chips";
import { addTokens } from "$lib/data/query/add-tokens";
import { getAchievementData, getFishingData } from "$lib/data/sheets/sheets";
import { pick } from "$lib/shared/random/pick";
import { error } from "@sveltejs/kit";
import { createCipheriv, createDecipheriv, scryptSync } from "node:crypto";
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
    const data = await getFishingData();
    const fishes = data.filter((x) => x.lure === body.lure);
    const result = pick(fishes);
    console.info(body.lure, result.name);
    const id = crypto.randomUUID();
    const key = result.key;
    const KEY = scryptSync(env.KEY, "안녕하세요소금입니다소금소금", 16);
    const cipher = createCipheriv("aes-128-gcm", KEY, env.IV);
    const next =
      cipher.update(JSON.stringify({ id, key }), "utf8", "base64url") +
      cipher.final("base64url");
    return await client.transaction(async (tx) => {
      await addLureItem(tx, user.id, body.lure, -1);

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
    err(e, re, body) {
      if (e instanceof DatabaseError) {
        if (e.constraint === "quantity_should_be_positive") {
          error(400, "미끼가 모자랍니다");
        }
      }
      throw e;
    },
  },
);

export type PUT = typeof PUT;
export const PUT = route(
  "put",
  async ({ locals }: RequestEvent, body) => {
    const user = locals.user;
    if (user == null || user.isBanned) error(401);
    const KEY = scryptSync(env.KEY, "안녕하세요소금입니다소금소금", 16);
    const decipher = createDecipheriv("aes-128-gcm", KEY, env.IV);
    const fish: { key: string } = JSON.parse(
      decipher.update(body.next, "base64url", "utf8"),
    );
    return await client.transaction(async (tx) => {
      if (fish.key.startsWith("losing-")) {
        await addGarbageItem(tx, user.id, fish.key, 1);
      } else {
        await addFishItem(tx, user.id, fish.key, 1);
      }
      const achievements = await onCaughtFish(tx, user.id, fish.key);
      if (achievements.length > 0) {
        await addAchievements(tx, user.id, achievements);
        const map = new Map(
          (await getAchievementData()).map((x) => [x.key, x]),
        );
        const money = achievements.reduce(
          (sum, x) => {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const _x = map.get(x)!;
            if (_x.reward.type === "chips") {
              sum.chips += _x.reward.quantity;
            }
            if (_x.reward.type === "tokens") {
              sum.tokens += _x.reward.quantity;
            }
            return sum;
          },
          { tokens: 0, chips: 0 },
        );
        if (money.tokens > 0) {
          await addTokens(tx, user.id, money.tokens);
        }
        if (money.chips > 0) {
          await addChips(tx, user.id, money.chips);
        }
      }
      return {
        achievements,
      };
    });
  },
  {
    body: z.object({
      next: z.string(),
    }),
    err(e) {
      console.error(e);
      error(406);
    },
  },
);

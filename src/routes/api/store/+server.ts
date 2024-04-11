import { route } from "$lib/api/server";
import { addItem } from "$lib/data/item/add-item.query";
import { addChipsByCurrentUser } from "$lib/data/query/add-chips-by-current-user.query";
import { addTokensByCurrentUser } from "$lib/data/query/add-tokens-by-current-user.query";
import { getStoreData } from "$lib/data/sheets/sheets";
import { groupBy } from "$lib/shared/util/group-by";
import { page } from "$routes/(main)/store/page.query";
import { error } from "@sveltejs/kit";
import { ConstraintViolationError } from "edgedb";
import { z } from "zod";
import type { RequestEvent } from "./$types";

export type POST = typeof POST;
export const POST = route(
  "post",
  async ({ locals }: RequestEvent, body) => {
    return await locals.client.transaction(async (tx) => {
      const storeData = await getStoreData();
      const storeMap = new Map(storeData.map((item) => [item.key, item]));

      const inventory = (
        await page(tx, {
          items: [
            "roulette-result-6",
            ...storeData.filter((x) => x.stock).map((x) => x.key),
          ],
        })
      ).reduce(
        (o, item) => {
          o[item.key] = item.quantity;
          return o;
        },
        {} as Record<string, number>,
      );
      const tickets = inventory["roulette-result-6"] ?? 0;
      if (body.tickets.length > tickets) {
        error(400, "티켓이 부족합니다");
      }
      const totalTickets = body.tickets.reduce(
        (o, key) => {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          const storeData = storeMap.get(key)!;
          if (storeData.price.type === "chips") {
            o.chips += storeData.price.quantity;
          } else if (storeData.price.type === "tokens") {
            o.tokens += storeData.price.quantity;
          }
          return o;
        },
        {
          chips: 0,
          tokens: 0,
        },
      );

      const config = body.items.reduce(
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
      console.info(config, totalTickets);
      if (body.tickets.length > 0) {
        await addItem(tx, {
          key: "roulette-result-6",
          quantity: -body.tickets.length,
          category: "ticket",
        });
      }
      if (config.chips > 0) {
        await addChipsByCurrentUser(tx, {
          chips: -config.chips + totalTickets.chips,
        });
      }
      if (config.tokens > 0) {
        await addTokensByCurrentUser(tx, {
          tokens: -config.tokens + totalTickets.tokens,
        });
      }
      for (const item of config.items) {
        await addItem(tx, item);
      }

      return {};
    });
  },
  {
    body: z.object({
      items: z
        .array(
          z.object({
            key: z.string().min(1),
            quantity: z.number().min(1),
          }),
        )
        .min(1),
      tickets: z.array(z.string().min(1)),
    }),
    err(e, re, body) {
      if (e instanceof ConstraintViolationError) {
        if (e.message.includes("chips")) {
          error(400, "칩이 부족합니다");
        }
        if (e.message.includes("tokens")) {
          error(400, "토큰이 부족합니다");
        }
      }
      throw e;
    },
  },
);

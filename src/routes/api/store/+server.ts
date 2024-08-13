import { route } from "$lib/api/server";
import { client } from "$lib/data/client";
import { addItem } from "$lib/data/item/add-item";
import { addTicketItem } from "$lib/data/item/add-ticket-item";
import { addChips } from "$lib/data/query/add-chips";
import { addTokens } from "$lib/data/query/add-tokens";
import { getStoreData } from "$lib/data/sheets/sheets";
import { getInventory } from "$lib/ui/store/get-inventory";
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
    return await client.transaction(async (tx) => {
      const storeData = await getStoreData();
      const storeMap = new Map(storeData.map((item) => [item.key, item]));

      const inventory = await getInventory(
        user.id,
        new Set([
          "roulette-result-6",
          ...storeData.filter((x) => x.stock).map((x) => x.key),
        ]),
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
        await addTicketItem(
          tx,
          user.id,
          "roulette-result-6",
          -body.tickets.length,
        );
      }
      if (config.chips > 0) {
        await addChips(tx, user.id, -config.chips + totalTickets.chips);
      }
      if (config.tokens > 0) {
        await addTokens(tx, user.id, -config.tokens + totalTickets.tokens);
      }
      for (const item of config.items) {
        await addItem(tx, item.category, user.id, item.key, item.quantity);
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
      if (e instanceof DatabaseError) {
        if (e.constraint === "chips_should_be_positive") {
          error(400, "칩이 부족합니다");
        }
        if (e.constraint === "tokens_should_be_positive") {
          error(400, "토큰이 부족합니다");
        }
      }
      throw e;
    },
  },
);

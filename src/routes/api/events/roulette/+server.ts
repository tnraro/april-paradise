import { route } from "$lib/api/server";
import { client } from "$lib/data/client";
import { addTicketItem } from "$lib/data/item/add-ticket-item";
import { addChips } from "$lib/data/query/add-chips";
import { addTokens } from "$lib/data/query/add-tokens";
import { getRouletteData } from "$lib/data/sheets/sheets";
import { pick } from "$lib/shared/random/pick";
import { error } from "@sveltejs/kit";
import pkg from "pg";
import type { RequestEvent } from "./$types";

const { DatabaseError } = pkg;

export type POST = typeof POST;
export const POST = route(
  "post",
  async ({ locals }: RequestEvent) => {
    const user = locals.user;
    if (user == null || user.isBanned) error(401);
    return await client.transaction(async (tx) => {
      await addTokens(tx, user.id, -1);
      const data = await getRouletteData();
      const result = pick(data);
      switch (result.result.type) {
        case "chips":
          await addChips(tx, user.id, result.result.quantity);
          break;
        case "tokens":
          await addTokens(tx, user.id, result.result.quantity);
          break;
        case "item":
          if (result.key.startsWith("losing-")) break;
          await addTicketItem(tx, user.id, result.key, 1);
          break;
      }
      return { result };
    });
  },
  {
    err(e) {
      if (e instanceof DatabaseError) {
        if (e.constraint === "tokens_should_be_positive") {
          error(400, "토큰이 부족합니다");
        }
      }
    },
  },
);

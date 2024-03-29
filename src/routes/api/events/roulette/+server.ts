import { route } from "$lib/api/server";
import { addTicketItem } from "$lib/data/item/add-ticket-item.query";
import { addChipsByCurrentUser } from "$lib/data/query/add-chips-by-current-user.query";
import { addTokensByCurrentUser } from "$lib/data/query/add-tokens-by-current-user.query";
import { getRouletteData } from "$lib/data/sheets/sheets";
import { pick } from "$lib/shared/random/pick";
import { error } from "@sveltejs/kit";
import { ConstraintViolationError } from "edgedb";
import type { RequestEvent } from "./$types";

export type POST = typeof POST;
export const POST = route(
  "post",
  async (e: RequestEvent) => {
    const client = e.locals.client;
    return await client.transaction(async (tx) => {
      await addTokensByCurrentUser(tx, {
        tokens: -1,
      });
      const data = await getRouletteData();
      const result = pick(data);
      switch (result.result.type) {
        case "chips":
          await addChipsByCurrentUser(tx, {
            chips: result.result.quantity,
          });
          break;
        case "tokens":
          await addTokensByCurrentUser(tx, {
            tokens: result.result.quantity,
          });
          break;
        case "item":
          if (result.key.startsWith("losing-")) break;
          await addTicketItem(client, {
            key: result.key,
          });
          break;
      }
      return { result };
    });
  },
  {
    err(e) {
      if (e instanceof ConstraintViolationError) {
        if (e.message.startsWith("Minimum allowed value for tokens")) {
          return error(400, "not enough tokens");
        }
      }
    },
  },
);

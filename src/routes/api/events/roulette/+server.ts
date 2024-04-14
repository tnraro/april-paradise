import { route } from "$lib/api/server";
import { addTicketItem } from "$lib/data/item/add-ticket-item";
import { addChips } from "$lib/data/query/add-chips.query";
import { addTokens } from "$lib/data/query/add-tokens.query";
import { getCurrentUser } from "$lib/data/query/get-current-user.query";
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
      const currentUser = await getCurrentUser(client);
      if (currentUser == null) error(401);
      await addTokens(tx, {
        tokens: -1,
        user: currentUser,
      });
      const data = await getRouletteData();
      const result = pick(data);
      switch (result.result.type) {
        case "chips":
          await addChips(tx, {
            chips: result.result.quantity,
            user: currentUser,
          });
          break;
        case "tokens":
          await addTokens(tx, {
            tokens: result.result.quantity,
            user: currentUser,
          });
          break;
        case "item":
          if (result.key.startsWith("losing-")) break;
          await addTicketItem(client, {
            key: result.key,
            owner: currentUser,
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

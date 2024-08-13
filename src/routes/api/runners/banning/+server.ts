import { route } from "$lib/api/server";
import { client } from "$lib/data/client";
import { users } from "$lib/data/schema";
import { error } from "@sveltejs/kit";
import { inArray } from "drizzle-orm";
import { z } from "zod";
import type { RequestEvent } from "./$types";

export type PUT = typeof PUT;
export const PUT = route(
  "put",
  async ({ locals }: RequestEvent, body) => {
    if (locals.user == null || locals.user.isBanned || !locals.user.isAdmin)
      error(401);
    await changeBanState(body.ban, body.users);
    return {};
  },
  {
    body: z.object({
      ban: z.boolean(),
      users: z.array(z.string().uuid()),
    }),
  },
);

async function changeBanState(isBanned: boolean, userIds: string[]) {
  await client
    .update(users)
    .set({
      isBanned,
    })
    .where(inArray(users.id, userIds));
}

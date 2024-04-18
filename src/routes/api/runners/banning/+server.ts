import { route } from "$lib/api/server";
import { error } from "@sveltejs/kit";
import { z } from "zod";
import type { RequestEvent } from "./$types";
import { put } from "./put.query";

export type PUT = typeof PUT;
export const PUT = route(
  "put",
  async ({ locals }: RequestEvent, body) => {
    if (
      locals.currentUser == null ||
      locals.currentUser.isBanned ||
      !locals.currentUser.isAdmin
    )
      error(401);
    await put(locals.client, {
      data: body,
    });
    return {};
  },
  {
    body: z.object({
      ban: z.boolean(),
      users: z.array(z.string().uuid()),
    }),
  },
);

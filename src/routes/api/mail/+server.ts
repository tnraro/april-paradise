import { route } from "$lib/api/server";
import { error } from "@sveltejs/kit";
import { z } from "zod";
import type { RequestEvent } from "./$types";
import { post } from "./post.query";

export type POST = typeof POST;
export const POST = route(
  "post",
  async ({ locals }: RequestEvent, body) => {
    if (
      locals.currentUser == null ||
      locals.currentUser.isBanned ||
      !locals.currentUser.isAdmin
    )
      error(401);
    await post(locals.client, {
      data: body,
    });
    return {};
  },
  {
    body: z.object({
      sender: z.string(),
      title: z.string(),
      body: z.string(),
      rewards: z.string().min(1),
      recipients: z.array(z.string().uuid()),
    }),
  },
);

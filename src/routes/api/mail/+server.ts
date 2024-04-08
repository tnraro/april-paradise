import { route } from "$lib/api/server";
import { z } from "zod";
import type { RequestEvent } from "./$types";
import { post } from "./post.query";

export type POST = typeof POST;
export const POST = route(
  "post",
  async (e: RequestEvent, body) => {
    await post(e.locals.client, {
      data: body,
    });
    return {};
  },
  {
    body: z.object({
      sender: z.string(),
      title: z.string(),
      body: z.string(),
      rewards: z.string(),
      recipients: z.array(z.string().uuid()),
    }),
  },
);

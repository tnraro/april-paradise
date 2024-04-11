import { route } from "$lib/api/server";
import { z } from "zod";
import type { RequestEvent } from "./$types";

export type POST = typeof POST;
export const POST = route(
  "post",
  async (e: RequestEvent, body) => {
    console.log(JSON.stringify(body));

    return {};
  },
  {
    body: z
      .array(
        z.object({
          key: z.string().min(1),
          quantity: z.number().min(1),
        }),
      )
      .min(1),
  },
);

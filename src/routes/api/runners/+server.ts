import { route } from "$lib/api/server";
import { createInviteCode } from "$lib/data/invite/create-invite-code.query";
import { getRunnerData } from "$lib/data/sheets/sheets";
import { z } from "zod";
import type { RequestEvent } from "./$types";
import { put } from "./put.query";

export type PUT = typeof PUT;
export const PUT = route("put", async ({ locals }: RequestEvent) => {
  const { client } = locals.auth.session;
  const runners = await getRunnerData();
  const updated = await put(client, {
    runners,
  });
  return {
    updated: updated.length,
  };
});

export type POST = typeof POST;
export const POST = route(
  "post",
  async ({ locals }: RequestEvent, body) => {
    const { code } = await createInviteCode(locals.auth.session.client, {
      key: body.key,
    });
    return {
      code,
    };
  },
  {
    body: z.object({ key: z.string() }),
  },
);

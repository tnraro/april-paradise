import { route } from "$lib/api/server";
import { createInviteCode } from "$lib/data/invite/create-invite-code.query";
import { getRunnerData } from "$lib/data/sheets/sheets";
import { error } from "@sveltejs/kit";
import { z } from "zod";
import type { RequestEvent } from "./$types";
import { put } from "./put.query";

export type PUT = typeof PUT;
export const PUT = route("put", async ({ locals }: RequestEvent) => {
  if (
    locals.currentUser == null ||
    locals.currentUser.isBanned ||
    !locals.currentUser.isAdmin
  )
    error(401);
  const runners = await getRunnerData();
  const updated = await put(locals.client, {
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
    if (
      locals.currentUser == null ||
      locals.currentUser.isBanned ||
      !locals.currentUser.isAdmin
    )
      error(401);
    const { code } = await createInviteCode(locals.client, {
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

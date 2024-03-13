import { route } from "$lib/api/server";
import { error } from "@sveltejs/kit";
import { z } from "zod";
import type { RequestEvent } from "./$types";
import { AccessPolicyError, EdgeDBError } from "edgedb";
import { get } from "./get.query";
import { post } from "./post.query";

export const GET = route("get", async ({ locals, params }: RequestEvent) => {
  const { id } = params;
  if (id == null) throw "adasadsadsadsadsadspkoadskopasdkpo";
  const { client } = locals.auth.session;
  const runner = await get(client, {
    id,
  });
  if (runner == null) error(404);
  return runner;
});
export type GET = typeof GET;

export const POST = route(
  "post",
  async ({ locals, params }: RequestEvent, body) => {
    const { id } = params;
    if (id == null) throw "adasadsadsadsadsadspkoadskopasdkpo";
    const { client } = locals.auth.session;
    await post(client, {
      id,
      penalties: body,
    });
    return {};
  },
  {
    body: z.array(
      z.object({
        id: z.string().uuid(),
        isBanned: z.boolean(),
        reason: z.string().nullish(),
      }),
    ),
    err(e) {
      if (e instanceof EdgeDBError) {
        if (e instanceof AccessPolicyError) {
          error(401);
        }
        return;
      }
    },
  },
);

export type POST = typeof POST;

import {
  getCurrentAdminProfile,
  getRunnerPenaltiesById,
  updateRunnerPenalties,
} from "$edgedb/queries";
import { route } from "$lib/api/server";
import { error } from "@sveltejs/kit";
import { z } from "zod";
import type { RequestEvent } from "./$types";

export const GET = route("get", async ({ locals, params }: RequestEvent) => {
  const { id } = params;
  if (id == null) throw "adasadsadsadsadsadspkoadskopasdkpo";
  const { client } = locals.auth.session;
  const runner = await getRunnerPenaltiesById(client, {
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
    if ((await getCurrentAdminProfile(client)) == null) {
      error(401);
    }
    await updateRunnerPenalties(client, {
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
  },
);

export type POST = typeof POST;

import {
  getCurrentAdminProfile,
  getRunnerPenaltiesById,
  updateRunnerPenalties,
} from "$edgedb/queries";
import { handle } from "$lib/api/handle";
import { error, type RequestEvent } from "@sveltejs/kit";
import { z } from "zod";

export interface GetRunnerPenaltiesById {
  response: Awaited<ReturnType<typeof get>>;
}
const get = async ({ locals, params }: RequestEvent) => {
  const { id } = params;
  if (id == null) throw "adasadsadsadsadsadspkoadskopasdkpo";
  const { client } = locals.auth.session;
  return await getRunnerPenaltiesById(client, {
    id,
  });
};

export const GET = handle(get);

export interface PostRunnerPenalties {
  body: z.infer<typeof postBodySchema>;
  response: Awaited<ReturnType<typeof post>>;
}
const postBodySchema = z.array(
  z.object({
    id: z.string().uuid(),
    isBanned: z.boolean(),
    reason: z.string().optional(),
  }),
);
const post = async ({ locals, params, request }: RequestEvent) => {
  const { id } = params;
  if (id == null) throw "adasadsadsadsadsadspkoadskopasdkpo";
  const { client } = locals.auth.session;
  if ((await getCurrentAdminProfile(client)) == null) {
    error(401);
  }
  const penalties = postBodySchema.parse(await request.json());
  await updateRunnerPenalties(client, {
    id,
    penalties,
  });
  return {};
};
export const POST = handle(post);

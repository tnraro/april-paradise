import { createRunner } from "$edgedb/queries";
import { handle } from "$lib/api/handle";
import { guardAdmin, logError, validateBody } from "$lib/api/plugin";
import { NAME } from "$lib/shared/schema/auth";
import { TWITTER_ID } from "$lib/shared/schema/runner";
import type { RequestEvent } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { EdgeDBError } from "edgedb";
import { z } from "zod";

export interface PostAdminRunners {
  body: z.infer<typeof postBodySchema>;
  response: Awaited<ReturnType<typeof post>>;
}
const postBodySchema = z.object({ name: NAME, twitterId: TWITTER_ID });
const post = async (event: RequestEvent, set: ResponseInit) =>
  guardAdmin(event)
    .then(validateBody(postBodySchema))
    .then(async ({ locals, body }) => {
      const session = locals.auth.session;
      await createRunner(session.client, {
        name: body.name,
        twitter_id: body.twitterId,
      });
      set.status = 201;
      return { created: true };
    })
    .catch(async (e) => {
      if (e instanceof EdgeDBError) {
        if (e.name === "ConstraintViolationError") {
          if (e.message.startsWith("name violates exclusivity constraint")) {
            return error(409, "conflict name");
          } else if (e.message.startsWith("twitter_id violates exclusivity constraint")) {
            return error(409, "conflict twitter id");
          }
        }
      }
      throw e;
    })
    .catch(logError("post /api/admin/runners"));

export const POST = handle(post);

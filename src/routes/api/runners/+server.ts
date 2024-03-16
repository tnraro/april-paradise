import { route } from "$lib/api/server";
import { NAME } from "$lib/shared/schema/auth";
import { TWITTER_ID } from "$lib/shared/schema/runner";
import { error } from "@sveltejs/kit";
import { ConstraintViolationError, EdgeDBError } from "edgedb";
import { z } from "zod";
import type { RequestEvent } from "./$types";
import { post } from "./post.query";

export const POST = route(
  "post",
  async (event: RequestEvent, body, set) => {
    const session = event.locals.auth.session;
    await post(session.client, body);
    set.status = 201;
    return { created: true };
  },
  {
    body: z.object({ name: NAME, twitterId: TWITTER_ID }),
    err(e) {
      if (e instanceof ConstraintViolationError) {
        if (e.message.startsWith("name violates exclusivity constraint")) {
          return error(409, "conflict name");
        }
        if (e.message.startsWith("twitterId violates exclusivity constraint")) {
          return error(409, "conflict twitter id");
        }
      }
    },
  },
);
export type POST = typeof POST;

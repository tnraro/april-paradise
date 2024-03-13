import { isCurrentUserAdmin } from "$lib/data/query/is-current-user-admin.query";
import { NAME } from "$lib/shared/schema/auth";
import { TWITTER_ID } from "$lib/shared/schema/runner";
import { ConstraintViolationError, EdgeDBError } from "edgedb";
import { Elysia, t } from "elysia";
import type { _App } from "../app";
import { post } from "./post.query";
import { penalties } from "./:id/penalties/route";

export const runners = (new Elysia() as _App).group("/runners", (app) =>
  app.use(penalties).post(
    "",
    async ({ locals, body, set }) => {
      const { client } = locals.auth.session;
      if (!(await isCurrentUserAdmin(client))) {
        set.status = "Unauthorized";
        return { message: "로그인하세요" };
      }
      await post(client, body);
      set.status = 201;
      return { created: true };
    },
    {
      body: t.Object({
        name: NAME,
        twitterId: TWITTER_ID,
      }),
      error({ error, set }) {
        if (error instanceof EdgeDBError) {
          if (error instanceof ConstraintViolationError) {
            if (error.message.startsWith("name ")) {
              set.status = "Conflict";
              return { message: "이미 있는 이름입니다" };
            } else if (error.message.startsWith("twitterId ")) {
              set.status = "Conflict";
              return { message: "이미 있는 트위터 아이디입니다" };
            }
          }
        }
      },
    },
  ),
);

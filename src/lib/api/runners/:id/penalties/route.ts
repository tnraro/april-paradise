import type { _App } from "$lib/api/app";
import { AccessPolicyError } from "edgedb";
import { Elysia, t } from "elysia";
import { get } from "./get.query";
import { post } from "./post.query";

export const penalties = (new Elysia() as _App).group(
  "/:id/penalties",
  {
    params: t.Object({
      id: t.String({
        format: "uuid",
      }),
    }),
  },
  (app) =>
    app
      .get("", async ({ params: { id }, locals, set }) => {
        const { client } = locals.auth.session;
        const runner = await get(client, {
          id,
        });
        if (runner == null) {
          set.status = "Not Found";
          return { message: "해당 러너가 없습니다" };
        }
        return runner;
      })
      .post(
        "",
        async ({ params: { id }, body, locals }) => {
          const { client } = locals.auth.session;
          await post(client, {
            id,
            penalties: body,
          });
          return {};
        },
        {
          body: t.Array(
            t.Object({
              id: t.String({
                format: "uuid",
              }),
              isBanned: t.Boolean(),
              reason: t.Optional(t.String()),
            }),
          ),
          error({ error, set }) {
            if (error instanceof AccessPolicyError) {
              set.status = "Unauthorized";
              return;
            }
          },
        },
      ),
);

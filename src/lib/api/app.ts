import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { liveblocks } from "./liveblocks";

export type App = typeof app;
export const app = new Elysia({ prefix: "/api" })
  .use(swagger())
  .onRequest(({ request }) => {
    console.log(request.url);
  })
  .get("", () => "hi")
  .post("/liveblocks/auth", async ({ set, cookie }) => {
    // if (!cookie.token.get()) {
    //   set.status = "Unauthorized";
    //   return;
    // }
    const user = {
      id: "raro",
      isAdmin: true,
      info: {
        name: "라로",
        avatar: "https://pbs.twimg.com/profile_images/1745816899328585731/iQDlxeIy_400x400.jpg",
      },
    };
    const { status, body } = await liveblocks.identifyUser(
      {
        userId: user.id,
        groupIds: [user.isAdmin ? "admin" : "user"],
      },
      {
        userInfo: user.info,
      },
    );
    set.status = status;
    return body;
  });

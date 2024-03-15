import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { liveblocks } from "./liveblocks";
import { storage } from "$lib/liveblocks/server";
import { range, roulette } from "$lib/app/roulette";

const table = [
  { result: "칩 10개", p: 30 },
  { result: "칩 50개", p: 20 },
  { result: "칩 100개", p: 5 },
  { result: "칩 500개", p: 1 },
  { result: "아이템 교환권", p: 1 },
  { result: "벌칙 수행권", p: 1 },
  { result: "칩 1000개", p: 0.5 },
  { result: "칩 2개", p: 1.5 },
];

export type App = typeof app;
export const app = new Elysia({ prefix: "/api" })
  .use(swagger())
  .onRequest(({ request }) => {
    console.info(request.method, request.url);
  })
  .get("", () => ({ hi: "hello" }))
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
  })
  .get("/me", async ({ set, cookie }) => {
    const token = cookie.token.get();
    console.log(token);
    const runners = storage.value.get("runners").toImmutable();

    const runner = runners.find((x) => x.id === token);
    if (runner == null) {
      throw (set.status = "Not Found");
    }
    return {
      name: runner.name,
      chips: runner.chips,
      tokens: runner.tokens,
    };
  })
  .get("/config/roulette", async ({ set, cookie }) => {
    const token = cookie.token.get();
    const root = storage.value.toImmutable();

    const runner = root.runners.find((x) => x.id === token);
    if (runner == null) {
      throw (set.status = "Unauthorized");
    }

    return table.map((x) => {
      return {
        result: x.result,
        p: x.p,
      };
    });
  })
  .post(
    "/roulette",
    async ({
      set,
      cookie,
    }): Promise<
      | { type: "chip"; n: number; text: string }
      | { type: "losing"; text: string }
      | { type: "item"; item: string; text: string }
    > => {
      const token = cookie.token.get();
      const runners = storage.value.get("runners");
      const runner = runners.find((runner) => runner.get("id") === token);
      if (runner == null) {
        throw (set.status = "Not Found");
      }
      const tokens = runner.get("tokens");
      if (tokens <= 0) {
        set.status = "Bad Request";
        throw { message: "no tokens" };
      }
      const { result, p } = roulette(table);
      runner.set("tokens", tokens - 1);
      console.log(result, p);

      if (result.startsWith("칩 ")) {
        let n = parseInt(result.slice(2));
        if (Number.isNaN(n)) {
          n = range(10, 500);
        }
        const chips = runner.get("chips");
        runner.set("chips", chips + n);

        return {
          type: "chip",
          n,
          text: result,
        };
      }

      if (result === "꽝") {
        return {
          type: "losing",
          text: result,
        };
      }

      return {
        type: "item",
        item: result,
        text: result,
      };
    },
  );

import { Elysia } from "elysia";
import { runners } from "./runners/route";
import { serverTiming } from "@elysiajs/server-timing";
import { swagger } from "@elysiajs/swagger";

export const locals = new WeakMap<Request, App.Locals>();

const _app = new Elysia({ prefix: "/api" })
  .onRequest(({ request }) => {
    console.log(request.method, new URL(request.url).pathname);
  })
  .use(
    serverTiming({
      allow({ request }) {
        return !new URL(request.url).pathname.startsWith("/api/swagger");
      },
    }),
  )
  .use(swagger())
  .derive(({ request }) => {
    return {
      locals: locals.get(request)!,
    };
  });
export type _App = typeof _app;
export type App = typeof app;
export const app = _app.use(runners).onError(({ code, error, request }) => {
  switch (code) {
    case "VALIDATION":
      return { message: error.all.map((e) => e.message).join("\n") };
  }
  console.error(request.url, code);
  return {
    name: error.name,
    message: error.message,
  };
});

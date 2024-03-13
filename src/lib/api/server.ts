import { error, json, type RequestEvent } from "@sveltejs/kit";
import { ZodError, type z } from "zod";

export const route = <
  M extends "get" | "post" | "put" | "delete",
  E extends RequestEvent,
  R,
  Z extends z.ZodTypeAny = z.ZodNever,
>(
  _method: M,
  handler: (e: E, body: z.infer<Z>, set: ResponseInit) => Promise<R> | R,
  options?: {
    err?: (e: unknown, re: E, body: z.infer<Z>) => void;
    body?: Z;
  },
) => {
  const p = async (re: E) => {
    try {
      const _body = options?.body?.parse(await re.request.json());
      try {
        const set = {} as ResponseInit;
        const res = await handler(re, _body, set);
        return json(res, set);
      } catch (e) {
        if (e instanceof ZodError) {
          error(400, e.errors.map((error) => error.message).join("\n"));
        }
        options?.err?.(e, re, _body);
        console.error("err", e);
        error(500);
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.error("err", e);
        error(400);
      }
      console.error("err", e);
      error(500);
    }
  };
  return p as typeof p & {
    returns: R;
    params: E["params"];
    route: E["route"]["id"];
    method: Uppercase<M>;
    body: z.infer<Z>;
  };
};

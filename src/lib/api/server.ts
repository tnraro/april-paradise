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
    let _body: any;
    try {
      _body = options?.body?.parse(await re.request.json());
    } catch (e) {
      if (e instanceof SyntaxError) {
        error(400);
      }
      if (e instanceof ZodError) {
        error(400, e.errors.map((error) => error.message).join("\n"));
      }
      console.error("err", e);
      error(500);
    }
    try {
      const set = {} as ResponseInit;
      console.log(3);
      const res = await handler(re, _body, set);
      console.log(2);
      return json(res, set);
    } catch (e) {
      options?.err?.(e, re, _body);
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

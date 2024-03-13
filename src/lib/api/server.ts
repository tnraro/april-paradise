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
    err?: (e: unknown) => void;
    body?: Z;
  },
) => {
  const p = async (e: E) => {
    try {
      const _body = options?.body?.parse(await e.request.json());
      const set = {} as ResponseInit;
      const res = await handler(e, _body, set);
      return json(res, set);
    } catch (e) {
      if (e instanceof ZodError) {
        error(400, e.errors.map((error) => error.message).join("\n"));
      }
      options?.err?.(e);
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

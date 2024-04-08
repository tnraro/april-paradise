import { route } from "$lib/api/server";
import type { RequestEvent } from "./$types";
import { get } from "./get.query";
import { put } from "./put.query";

export type GET = typeof GET;
export const GET = route("get", async (e: RequestEvent) => {
  const mail = await get(e.locals.client, {
    id: e.params.id,
  });

  return {
    mail,
  };
});

export type PUT = typeof PUT;
export const PUT = route("put", async (e: RequestEvent) => {
  await put(e.locals.client, {
    id: e.params.id,
  });

  return {};
});

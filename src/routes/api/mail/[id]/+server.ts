import { route } from "$lib/api/server";
import type { RequestEvent } from "./$types";
import { get } from "./get.query";

export type GET = typeof GET;
export const GET = route("get", async (e: RequestEvent) => {
  const mail = await get(e.locals.client, {
    id: e.params.id,
  });

  return {
    mail,
  };
});

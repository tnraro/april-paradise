import { route } from "$lib/api/server";
import { getRunnerData } from "$lib/data/sheets/sheets";
import type { RequestEvent } from "./$types";
import { put } from "./put.query";

export type PUT = typeof PUT;
export const PUT = route("put", async ({ locals }: RequestEvent) => {
  const { client } = locals.auth.session;
  const runners = await getRunnerData();
  const updated = await put(client, {
    runners,
  });
  return {
    updated: updated.length,
  };
});

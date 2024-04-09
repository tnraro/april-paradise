import { route } from "$lib/api/server";
import { getIndexData } from "$lib/data/sheets/sheets";
import { update } from "$lib/data/sheets/sync";
import type { RequestEvent } from "./$types";

export type GET = typeof GET;
export const GET = route("get", async (e: RequestEvent) => {
  return getIndexData();
});

export type PUT = typeof PUT;
export const PUT = route("put", async (e: RequestEvent) => {
  await update();
  return {};
});

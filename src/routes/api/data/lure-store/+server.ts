import { route } from "$lib/api/server";
import { getLureData } from "$lib/data/sheets/sheets";
import type { RequestEvent } from "./$types";

export type GET = typeof GET;
export const GET = route("get", async (e: RequestEvent) => {
  return getLureData();
});

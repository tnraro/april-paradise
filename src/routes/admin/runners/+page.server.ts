import { client } from "$lib/data/client";
import { users } from "$lib/data/schema";
import { error, redirect } from "@sveltejs/kit";
import { not, sql } from "drizzle-orm";

export const load = async ({ locals, depends }) => {
  depends("admin:runners");
  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  if (!locals.user.isAdmin) {
    error(404);
  }
  const runners = await getRunners();
  return {
    runners,
  };
};

async function getRunners() {
  return await client
    .select({
      id: users.id,
      name: users.name,
      chips: users.chips,
      tokens: users.tokens,
      isBanned: users.isBanned,
      hasIdentity: sql<boolean>`true`,
    })
    .from(users)
    .where(not(users.isAdmin))
    .orderBy(users.isBanned);
}

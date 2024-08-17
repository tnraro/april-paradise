import { client, single } from "$lib/data/client";
import { getInventory } from "$lib/data/query/get-inventory";
import { getMails } from "$lib/data/query/get-mails";
import { users } from "$lib/data/schema";
import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async ({ locals, depends, params }) => {
  depends("admin:runners");

  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  if (!locals.user.isAdmin) {
    error(404);
  }
  const user = await getUser(params.key);

  if (user == null) {
    error(404);
  }

  return {
    user,
  };
};

async function getUser(name: string) {
  return await client.transaction(async (tx) => {
    const userBase = single(
      await tx
        .select({
          id: users.id,
          name: users.name,
          chips: users.chips,
          tokens: users.tokens,
          isAdmin: users.isAdmin,
          isBanned: users.isBanned,
        })
        .from(users)
        .where(eq(users.name, name)),
    );
    if (userBase == null) return null;
    const mails = await getMails(tx, userBase.id);
    const inventory = await getInventory(tx, userBase.id);
    return {
      ...userBase,
      hasIdentity: true,
      mails,
      inventory,
    };
  });
}

import { client } from "$lib/data/client";
import { users } from "$lib/data/schema";
import { error, redirect } from "@sveltejs/kit";
import { eq, not, or } from "drizzle-orm";

export const load = async ({ locals, depends, params }) => {
  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  if (!locals.user.isAdmin) {
    error(404);
  }
  depends("admin:runners");
  const users = await getUsers(locals.user?.id);

  return {
    users: users.map((user) => ({
      ...user,
      selected: params.key === user.name,
    })),
    selected: params.key,
  };
};

async function getUsers(userId: string) {
  return await client
    .select({
      id: users.id,
      name: users.name,
      isAdmin: users.isAdmin,
      isBanned: users.isBanned,
    })
    .from(users)
    .where(or(not(users.isAdmin), eq(users.id, userId)))
    .orderBy(users.isAdmin, users.isBanned);
}

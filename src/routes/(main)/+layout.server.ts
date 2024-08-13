import { client, single } from "$lib/data/client.js";
import { mails, users } from "$lib/data/schema.js";
import { getItemData, getScheduleData } from "$lib/data/sheets/sheets.js";
import { redirect } from "@sveltejs/kit";
import { and, count, eq, not, sql } from "drizzle-orm";

export const load = async ({ locals, depends }) => {
  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }

  const user = await getUser(locals.user.id);
  const itemData = await getItemData();
  const scheduleData = await getScheduleData();

  depends("header");

  return {
    user,
    itemData,
    scheduleData,
  };
};

async function getUser(id: string) {
  const m = client.$with("m").as(
    client
      .select({
        mails: count(mails.id).as("mails"),
      })
      .from(mails)
      .where(and(eq(mails.recipient, id), not(mails.isReceived))),
  );
  return single(
    await client
      .with(m)
      .select({
        name: users.name,
        tokens: users.tokens,
        chips: users.chips,
        isAdmin: users.isAdmin,
        mails: m.mails,
      })
      .from(users)
      .leftJoin(m, sql`true`)
      .where(eq(users.id, id)),
  );
}

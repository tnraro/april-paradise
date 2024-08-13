import { route } from "$lib/api/server";
import { type Client, client, single } from "$lib/data/client";
import { addItem } from "$lib/data/item/add-item";
import { addChips } from "$lib/data/query/add-chips";
import { addTokens } from "$lib/data/query/add-tokens";
import { getMail } from "$lib/data/query/get-mails";
import { mails } from "$lib/data/schema";
import { getItemData } from "$lib/data/sheets/sheets";
import { error } from "@sveltejs/kit";
import { and, eq, not } from "drizzle-orm";
import type { RequestEvent } from "./$types";

export type GET = typeof GET;
export const GET = route("get", async ({ locals, params }: RequestEvent) => {
  if (locals.user == null || locals.user.isBanned) error(401);
  const mail = await getMail(client, params.id);

  return {
    mail,
  };
});

export type PUT = typeof PUT;
export const PUT = route("put", async ({ locals, params }: RequestEvent) => {
  const user = locals.user;
  if (user == null || user.isBanned) error(401);
  return await client.transaction(async (tx) => {
    const itemData = await getItemData();

    const items = new Map(itemData.map((x) => [x.key, x]));

    const rewards = await markAsRead(tx, params.id, user.id);

    if (rewards == null) {
      return {};
    }

    for (const reward of rewards.split(",")) {
      const [key, _quantity] = reward.split(":");
      const quantity = Number(_quantity);

      if (key === "chip") {
        await addChips(tx, user.id, quantity);
      } else if (key === "token") {
        await addTokens(tx, user.id, quantity);
      } else {
        const item = items.get(key);
        if (item == null) throw new Error(`no item: ${key}`);
        await addItem(tx, item.category, user.id, item.key, quantity);
      }
    }

    return {};
  });
});

async function markAsRead(tx: Client, mailId: string, recipient: string) {
  return single(
    await tx
      .update(mails)
      .set({
        isReceived: true,
      })
      .where(
        and(
          eq(mails.id, mailId),
          and(eq(mails.recipient, recipient), not(mails.isReceived)),
        ),
      )
      .returning({
        rewards: mails.rewards,
      }),
  )?.rewards;
}

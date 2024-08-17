import { and, desc, eq } from "drizzle-orm";
import { type Client, single } from "../client";
import { mails } from "../schema";

export async function getMails(tx: Client, recipient: string) {
  return await tx
    .select({
      id: mails.id,
      sender: mails.sender,
      title: mails.title,
      isReceived: mails.isReceived,
      createdAt: mails.createdAt,
    })
    .from(mails)
    .where(eq(mails.recipient, recipient))
    .orderBy(mails.isReceived, desc(mails.createdAt));
}

export async function getMail(tx: Client, mailId: string, userId?: string) {
  const prefix = tx
    .select({
      id: mails.id,
      sender: mails.sender,
      title: mails.title,
      body: mails.body,
      rewards: mails.rewards,
      isReceived: mails.isReceived,
      createdAt: mails.createdAt,
    })
    .from(mails);
  const query =
    userId == null
      ? prefix.where(eq(mails.id, mailId))
      : prefix.where(and(eq(mails.id, mailId), eq(mails.recipient, userId)));
  return single(await query);
}

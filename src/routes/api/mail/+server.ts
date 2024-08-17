import { route } from "$lib/api/server";
import { client } from "$lib/data/client";
import { mails } from "$lib/data/schema";
import { error } from "@sveltejs/kit";
import { z } from "zod";
import type { RequestEvent } from "./$types";

export type POST = typeof POST;
export const POST = route(
  "post",
  async ({ locals }: RequestEvent, body) => {
    if (locals.user == null || locals.user.isBanned || !locals.user.isAdmin)
      error(401);
    await sendMails(body);
    return {};
  },
  {
    body: z.object({
      sender: z.string(),
      title: z.string(),
      body: z.string(),
      rewards: z.string().min(1),
      recipients: z.array(z.string().uuid()),
    }),
  },
);

async function sendMails(mail: {
  sender: string;
  title: string;
  body: string;
  rewards: string;
  recipients: string[];
}) {
  await client.insert(mails).values(
    mail.recipients.map((recipient) => ({
      title: mail.title,
      body: mail.body,
      rewards: mail.rewards,
      sender: mail.sender,
      recipient,
    })),
  );
}

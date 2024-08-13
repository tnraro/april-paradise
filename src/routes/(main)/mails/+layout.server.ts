import { client } from "$lib/data/client";
import { getMails } from "$lib/data/query/get-mails";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  const mails = await getMails(client, locals.user.id);

  return {
    mails,
  };
};

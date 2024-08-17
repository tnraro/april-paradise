import { client } from "$lib/data/client";
import { getMail } from "$lib/data/query/get-mails";
import { error, redirect } from "@sveltejs/kit";

export const load = async ({ locals, params }) => {
  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  const mail = await getMail(client, params.id, locals.user.id);

  if (mail == null) {
    error(404);
  }

  return {
    mail,
  };
};

import { getRunnerKeyByInviteCode } from "$lib/data/invite/get-runner-key-by-invite-code.query";
import { useInviteCode } from "$lib/data/invite/use-invite-code.query";
import { wrapRunnerData } from "$lib/data/sheets/utils.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";
import { schema } from "./schema";

export const load = async ({ url, locals }) => {
  try {
    const code = z.string().uuid().parse(url.searchParams.get("code"));
    const inviteCode = await getRunnerKeyByInviteCode(locals.client, {
      code,
    });
    if (inviteCode == null) throw "key is null";
    const runner = await wrapRunnerData({ key: inviteCode.key });
    if (runner == null) throw "runner is null";

    return {
      runner,
      form: await superValidate(
        {
          code,
        },
        zod(schema),
        { errors: false },
      ),
    };
  } catch (e) {
    console.error(e);
    error(400);
  }
};

export const actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(schema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { id, password, code } = form.data;

    try {
      const { tokenData } = await locals.auth.emailPasswordSignUp({
        email: `${id}@tnraro.com`,
        password,
      });
      if (tokenData?.identity_id == null) return fail(401, { form });

      const inviteCode = await useInviteCode(locals.client, {
        code,
        identity: tokenData.identity_id,
      });
      if (inviteCode == null) return fail(401, { form });
    } catch (e) {
      if (e instanceof Error) {
        const message = JSON.parse(e.message);
        if (message.error.code === 50331648) {
          return setError(form, "id", "이미 있는 계정입니다");
        }
      }
      console.error(e);
      error(500);
    }
    return redirect(303, "/");
  },
};

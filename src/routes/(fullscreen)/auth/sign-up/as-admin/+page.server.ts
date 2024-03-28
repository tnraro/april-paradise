import { isScheduleStarted } from "$lib/data/sheets/utils.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { page } from "./page.query";
import { schema } from "./schema";

export const load = async () => {
  if (await isScheduleStarted("커뮤")) {
    error(404, "Not Found");
  }

  const form = await superValidate(zod(schema));
  return { form };
};

export const actions = {
  default: async ({ locals, request }) => {
    if (await isScheduleStarted("커뮤")) {
      return fail(401);
    }
    const form = await superValidate(request, zod(schema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { id, password, name } = form.data;
    const email = `${id}@tnraro.com`;

    try {
      const { tokenData } = await locals.auth.emailPasswordSignUp({
        email,
        password,
      });

      if (tokenData?.identity_id == null) {
        throw "token is null";
      }

      await page(locals.client, {
        key: name,
        identity: tokenData.identity_id,
      });
    } catch (error) {
      if (error instanceof Error) {
        const e = JSON.parse(error.message);
        if (e.error.code === 50331648) {
          return setError(form, "id", "이미 등록된 아이디입니다");
        }
      }
      console.error(error);
      return fail(500, { form });
    }
    return redirect(303, "/admin");
  },
};

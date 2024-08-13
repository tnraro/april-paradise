import { type Actions, fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { schema } from "./schema";

export const load = async () => {
  return {
    form: await superValidate(zod(schema)),
  };
};

export const actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(schema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { userId, password } = form.data;

    if (
      !(await locals.auth.signIn({
        userId,
        password,
      }))
    ) {
      return setError(
        form,
        "password",
        "아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.",
      );
    }
    return redirect(303, "/");
  },
} satisfies Actions;

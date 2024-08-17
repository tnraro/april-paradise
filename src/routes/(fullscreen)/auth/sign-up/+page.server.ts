import { fail, redirect } from "@sveltejs/kit";
import pkg from "pg";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { schema } from "./schema";

const { DatabaseError } = pkg;

export const load = async () => {
  const form = await superValidate(zod(schema));
  return { form };
};

export const actions = {
  default: async ({ locals, request }) => {
    const form = await superValidate(request, zod(schema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { userId, password, name } = form.data;

    try {
      await locals.auth.signUp({
        userId,
        name,
        password,
      });
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.constraint === "user_userId_unique") {
          return setError(form, "userId", "이미 등록된 아이디입니다");
        }
        if (error.constraint === "user_name_unique") {
          return setError(form, "name", "이미 등록된 이름입니다");
        }
      }
      console.error(error);
      return fail(500, { form });
    }
    return redirect(303, "/");
  },
};

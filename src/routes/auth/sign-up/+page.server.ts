import { ID, PASSWORD } from "$lib/shared/schema/auth";
import { fail, isRedirect, redirect, type Actions } from "@sveltejs/kit";
import { ErrorCode } from "./lib";

export const actions = {
  default: async ({ request, locals }) => {
    let id: string | undefined;
    try {
      const data = await request.formData();
      id = ID.parse(data.get("id"));
      const password = PASSWORD.parse(data.get("password"));
      // TODO: use id instead of email only this time
      const email = `${id}@tnraro.com`;

      const { tokenData } = await locals.auth.emailPasswordSignUp({
        email,
        password,
      });

      if (tokenData == null) {
        throw "token is null";
      }

      return redirect(303, "/");
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      if (error instanceof Error) {
        try {
          const e = JSON.parse(error.message) as { error?: { code?: number } };
          const code = e.error?.code;
          switch (code) {
            case ErrorCode.AlreadyRegistered:
              return fail(400, {
                id,
                code,
              });
          }
        } catch (_) {}
      }
      console.error("err(sign-up):", error);
      return fail(400, {
        id,
      });
    }
  },
} satisfies Actions;

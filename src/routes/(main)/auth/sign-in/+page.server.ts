import { ID, PASSWORD } from "$lib/shared/schema/auth.js";
import { type Actions, fail, isRedirect, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, locals }) => {
    let id: string | undefined;
    try {
      const data = await request.formData();
      id = ID.parse(data.get("id"));
      const password = PASSWORD.parse(data.get("password"));
      // TODO: use id instead of email only this time
      const email = `${id}@tnraro.com`;

      const { tokenData, error } = await locals.auth.emailPasswordSignIn({
        email,
        password,
      });

      if (tokenData == null) {
        throw error;
      }
      return redirect(303, "/");
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      console.error("err(sign-in):", error);
      return fail(400, {
        success: false,
        id,
      });
    }
  },
} satisfies Actions;

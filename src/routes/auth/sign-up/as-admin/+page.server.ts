import { isGameSessionStarted } from "$lib/data/query/is-game-session-started.query";
import { IDz, NAMEz, PASSWORDz } from "$lib/shared/schema/auth";
import { error, fail, isRedirect, redirect } from "@sveltejs/kit";
import { ZodError } from "zod";

export const load = async ({ locals }) => {
  const session = locals.auth.session;

  if (!(await isGameSessionStarted(session.client))) {
    // admin mode
    return {};
  }
  // access denied
  error(404, "Not Found");
};

export const actions = {
  default: async ({ locals, request }) => {
    let id: string | undefined;
    let name: string | undefined;
    try {
      const { session } = locals.auth;
      if (await isGameSessionStarted(session.client)) {
        return fail(401);
      }
      const form = await request.formData();
      id = IDz.parse(form.get("id"));
      name = NAMEz.parse(form.get("name"));
      const password = PASSWORDz.parse(form.get("password"));
      const email = `${id}@tnraro.com`;

      const { tokenData } = await locals.auth.emailPasswordSignUp({
        email,
        password,
      });

      if (tokenData == null) {
        throw "token is null";
      }
      redirect(303, `/auth/sign-up/as-admin/callback?name=${encodeURIComponent(name)}`);
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      if (error instanceof ZodError) {
        return fail(400, { id, name, error: error.errors.map((e) => e.message).join("\n") });
      }
      if (error instanceof Error) {
        try {
          const e = JSON.parse(error.message) as { error?: { message?: string } };
          return fail(400, { id, name, error: e.error?.message });
        } catch (_) {
          console.error(_);
        }
      }
      console.error("err(sign-up as-admin):", error);
      return fail(500, { id, name, error: "unhandled error" });
    }
  },
};

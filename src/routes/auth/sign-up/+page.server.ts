import { ID, PASSWORD } from "$lib/shared/schema/auth";
import { fail, isRedirect, redirect, type Actions, error } from "@sveltejs/kit";
import { ErrorCode } from "./lib";
import { createHost, isStarted } from "$edgedb/queries";
import { z } from "zod";

class CustomError extends Error {
  code;
  constructor(code: ErrorCode) {
    super("");
    this.code = code;
  }
}

export const load = async ({ locals }) => {
  const session = locals.auth.session;

  if (!(await isStarted(session.client))) {
    // host mode
    return {};
  }
  // access denied
  error(404, "Not Found");
};

export const actions = {
  default: async ({ request, locals }) => {
    let id: string | undefined;
    let name: string | undefined;
    try {
      const session = locals.auth.session;
      if (await isStarted(session.client)) {
        throw new CustomError(ErrorCode.SessionStarted);
      }

      const data = await request.formData();
      id = ID.parse(data.get("id"));
      name = z.string().parse(data.get("name"));
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

      if (!(await session.isSignedIn())) {
        throw "not signed in";
      }
      await createHost(session.client, {
        name,
      });

      return redirect(303, "/");
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      if (error instanceof CustomError) {
        const code = error.code;
        return fail(400, {
          id,
          name,
          code,
        });
      }
      if (error instanceof Error) {
        try {
          const e = JSON.parse(error.message) as { error?: { code?: number } };
          const code = e.error?.code;
          switch (code) {
            case ErrorCode.AlreadyRegistered:
              return fail(400, {
                id,
                name,
                code,
              });
          }
        } catch (_) {}
      }
      console.error("err(sign-up):", error);
      return fail(400, {
        id,
        name,
      });
    }
  },
} satisfies Actions;

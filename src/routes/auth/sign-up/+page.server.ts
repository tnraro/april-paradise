import { generatePKCE } from "$lib/app/auth/auth";
import { registerAuth } from "$lib/app/auth/register";
import { commonCookieOptions } from "$lib/shared/config/cookie";
import { ID, PASSWORD } from "$lib/shared/schema/auth";
import { fail, type Actions, redirect, isRedirect } from "@sveltejs/kit";
import { ErrorCode } from "./lib";

export const actions = {
  default: async ({ request, cookies }) => {
    let id: string | undefined;
    try {
      const data = await request.formData();
      id = ID.parse(data.get("id"));
      const password = PASSWORD.parse(data.get("password"));
      // TODO: use id instead of email only this time
      const email = `${id}@tnraro.com`;

      const pkce = generatePKCE();

      await registerAuth({
        challenge: pkce.challenge,
        email,
        password,
        verfiyUrl: `http://localhost:5173/auth/verify`,
      });

      cookies.set("edgedb-pkce-verifier", pkce.verifier, commonCookieOptions);

      return redirect(303, "/");
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      console.error("err(sign-up):", error);
      if ((error as any).error?.code === 50331648) {
        return fail(400, {
          id,
          code: ErrorCode.AlreadyRegistered,
        });
      }
      return fail(400, {
        id,
      });
    }
  },
} satisfies Actions;

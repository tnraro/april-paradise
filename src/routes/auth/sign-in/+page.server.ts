import { env } from "$env/dynamic/private";
import { generatePKCE } from "$lib/app/auth/auth";
import { authenticateAuth } from "$lib/app/auth/authenticate";
import { getAuthToken } from "$lib/app/auth/token";
import { commonCookieOptions } from "$lib/shared/config/cookie";
import { ID, PASSWORD } from "$lib/shared/schema/auth.js";
import { fail, type Actions, redirect, isRedirect } from "@sveltejs/kit";

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

      const { code } = await authenticateAuth({
        challenge: pkce.challenge,
        email,
        password,
      });

      const authToken = await getAuthToken({
        code,
        verifier: pkce.verifier,
      });

      cookies.set("edgedb-auth-token", authToken, commonCookieOptions);

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

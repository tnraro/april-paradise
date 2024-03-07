import { env } from "$env/dynamic/private";
import { getAuthToken } from "$lib/app/auth/token.js";
import { commonCookieOptions } from "$lib/shared/config/cookie.js";
import { error } from "@sveltejs/kit";

export const GET = async ({ url, cookies }) => {
  const code = url.searchParams.get("code");
  if (code == null) {
    const e = url.searchParams.get("error");
    return error(400, `${e}`);
  }
  const verifier = cookies.get("edgedb-pkce-verifier");
  if (verifier == null) {
    return error(400, "Could not find 'verifier'");
  }

  const authToken = await getAuthToken({
    code,
    verifier,
  });

  cookies.set("edgedb-auth-token", authToken, commonCookieOptions);
  return new Response(null, { status: 204 });
};

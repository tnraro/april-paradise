import { env } from "$env/dynamic/private";

export interface TokenOptions {
  code: string;
  verifier: string;
}
export const getAuthToken = async ({ code, verifier }: TokenOptions) => {
  const url = new URL("token", env.EDGEDB_AUTH_BASE_URL);
  url.searchParams.set("code", code);
  url.searchParams.set("verifier", verifier);
  const res = await fetch(url);
  if (!res.ok) {
    throw await res.json();
  }

  const { auth_token: authToken } = await res.json();
  return authToken as string;
};

import { env } from "$env/dynamic/private";

export interface AuthenticateOptions {
  challenge: string;
  email: string;
  password: string;
  provider?: string;
}
export const authenticateAuth = async ({
  challenge,
  email,
  password,
  provider = "builtin::local_emailpassword",
}: AuthenticateOptions) => {
  const url = new URL("authenticate", env.EDGEDB_AUTH_BASE_URL);
  const res = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      challenge,
      email,
      password,
      provider,
    }),
  });
  if (!res.ok) {
    throw await res.json();
  }
  return (await res.json()) as { code: string };
};

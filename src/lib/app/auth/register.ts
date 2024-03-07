import { env } from "$env/dynamic/private";

export interface RegisterOptions {
  challenge: string;
  email: string;
  password: string;
  provider?: string;
  verfiyUrl: string;
}
export const registerAuth = async ({
  challenge,
  email,
  password,
  provider = "builtin::local_emailpassword",
  verfiyUrl,
}: RegisterOptions) => {
  const url = new URL("register", env.EDGEDB_AUTH_BASE_URL);
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
      verify_url: verfiyUrl,
    }),
  });
  if (!res.ok) {
    throw await res.json();
  }
};

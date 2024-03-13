import { page } from "./page.query";

export const load = async ({ locals, depends }) => {
  depends("admin:runners");
  const session = locals.auth.session;
  const runners = await page(session.client);
  return {
    runners,
  };
};

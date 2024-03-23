import { layout } from "./layout.query.js";

export const load = async ({ locals, depends }) => {
  const session = locals.auth.session;
  const isSignedIn = await session.isSignedIn();
  const user = await layout(session.client);
  depends(`header:${user?.name}`);

  return {
    isSignedIn,
    user,
  };
};

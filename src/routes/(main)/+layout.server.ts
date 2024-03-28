import { wrapRunnerData } from "$lib/data/sheets/utils.js";
import { layout } from "./layout.query.js";

export const load = async ({ locals, depends }) => {
  const session = locals.auth.session;
  const isSignedIn = await session.isSignedIn();
  const user = await wrapRunnerData(layout(session.client));
  if (user) {
    depends(`header:${user.key}`);
  }

  return {
    isSignedIn,
    user,
  };
};

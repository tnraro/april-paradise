import { wrapRunnerData } from "$lib/data/sheets/utils.js";
import { layout } from "./layout.query.js";

export const load = async ({ locals, depends }) => {
  const session = locals.auth.session;
  const user = await layout(session.client);
  if (user) {
    depends("header");

    if (user.isAdmin) {
      return {
        user: {
          ...user,
          name: user.key,
        },
      };
    }
    return {
      user: await wrapRunnerData(user),
    };
  }

  return {
    user,
  };
};

import { getItemData } from "$lib/data/sheets/sheets.js";
import { wrapRunnerData } from "$lib/data/sheets/utils.js";
import { layout } from "./layout.query.js";

export const load = async ({ locals, depends }) => {
  const session = locals.auth.session;
  const user = await layout(session.client);
  const itemData = await getItemData();
  if (user) {
    depends("header");

    if (user.isAdmin) {
      return {
        user: {
          ...user,
          name: user.key,
        },
        itemData,
      };
    }
    return {
      user: await wrapRunnerData(user),
      itemData,
    };
  }

  return {
    user,
    itemData,
  };
};

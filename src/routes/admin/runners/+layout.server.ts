import { wrapUsers } from "$lib/data/sheets/utils";
import { layout } from "./layout.query";

export const load = async ({ locals, depends, params }) => {
  depends("admin:runners");
  const users = await wrapUsers(layout(locals.client));

  return {
    users: users.map((user) => ({
      ...user,
      selected: params.key === user.key,
    })),
    selected: params.key,
  };
};

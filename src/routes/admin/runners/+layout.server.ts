import { wrapUsers } from "$lib/data/sheets/utils";
import { layout } from "./layout.query";

export const load = async ({ locals, depends, params }) => {
  depends("admin:runners");

  const session = locals.auth.session;
  const users = await wrapUsers(layout(session.client));

  return {
    users: users.map((user) => ({
      ...user,
      selected: params.key === user.key,
    })),
    selected: params.key,
  };
};

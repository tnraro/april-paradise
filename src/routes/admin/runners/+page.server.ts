import { getAllRunnersForListView } from "$edgedb/queries.js";

export const load = async ({ locals, depends }) => {
  depends("admin:runners");
  const session = locals.auth.session;
  const runners = await getAllRunnersForListView(session.client);
  return {
    runners,
  };
};

import { layout } from "./layout.query.js";

export const load = async ({ locals }) => {
  const mails = await layout(locals.client);

  return {
    mails,
  };
};

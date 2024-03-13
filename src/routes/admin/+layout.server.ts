import { layout } from "./layout.query";
import { error } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const session = locals.auth.session;
  const admin = await layout(session.client);
  if (admin == null) {
    return error(401, "권한이 없습니다");
  }

  return {
    admin,
  };
};

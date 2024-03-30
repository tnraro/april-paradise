import { error } from "@sveltejs/kit";
import { sbs } from "../stylebook.setup.js";

export const load = async ({ params }) => {
  if (!sbs.has(`/${params.route}`)) {
    error(404);
  }
  return {
    path: params.route,
  };
};

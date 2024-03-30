import { error } from "@sveltejs/kit";
import { sbs } from "../setup.js";

export const load = async ({ params }) => {
  if (!sbs.has(params.id)) {
    error(404);
  }
  return {
    id: params.id,
  };
};

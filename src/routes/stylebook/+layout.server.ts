import { sbs } from "./stylebook.setup";

export const load = async () => {
  return {
    sbs: [...sbs.values()].map((x) => ({ path: x.path })),
  };
};

import { sbs } from "./setup";

export const load = async () => {
  const s = await Promise.all(
    [...sbs.values()].map(async (x) => ({
      ...x,
      mod: await x.mod(),
    })),
  );

  return {
    sbs: s.map((x) => ({
      id: x.id,
      path: x.path,
      variants: [...Object.keys(x.mod.meta.variants)],
    })),
  };
};

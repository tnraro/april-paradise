import type { StylebookMod } from "$lib/ui/stylebook";

const modules = import.meta.glob<boolean, string, { meta: StylebookMod }>(
  "$lib/ui/**/*.sb.ts",
);

export const sbs = new Map(
  Object.entries(modules).map(([key, mod]) => {
    const path = key.slice("/src/lib/ui".length, -".sb.ts".length);
    const name = path.match(/(?<=\/)[^/]+$/);
    return [
      path,
      {
        path,
        name,
        fullpath: key,
        mod,
      },
    ];
  }),
);

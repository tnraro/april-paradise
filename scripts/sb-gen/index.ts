import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { write } from "bun";

const uiRoot = join(import.meta.dir, "../../src/lib/ui");
const sbPath = join(import.meta.dir, "../../src/routes/stylebook");

const files = await readdir(uiRoot, { recursive: true });

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const root: any = {};

for (const filename of files) {
  const m = filename.match(/^(?<path>.+?)\/(?<name>[^/]+)\.sb\.[tj]s$/);
  if (m == null) continue;

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const { path, name } = m.groups!;

  const { meta } = await import(join(uiRoot, path, `${name}.sb.ts`));

  root[path] = root[path] ?? [];
  root[path].push({
    name,
    path,
    component: join("$lib/ui", path, `${name}.svelte`),
    meta: join("$lib/ui", path, `${name}.sb.ts`),
    variants: [...Object.entries(meta.variants)].map(([name]) => name),
  });
}

const paths = [...Object.entries(root)].map(([path, books]) => ({
  path,
  books,
}));

for (const { path, books } of paths) {
  write(join(sbPath, "paths.json"), JSON.stringify(path));
}

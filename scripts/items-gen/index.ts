import { write } from "bun";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const itemsDir = join(import.meta.dir, "../../src/lib/ui/resources/items");
const items = await readdir(itemsDir);
const outPath = join(
  import.meta.dir,
  "../../src/lib/ui/resources/items.gen.ts",
);

const s: string[] = [];

s.push(
  items
    .map((filename, i) => `import src${i} from "$img/items/${filename}?enhanced&w=64";`)
    .join("\n"),
);
s.push("export function getItems(key: string) {");
s.push("  switch (key) {");
s.push(
  items
  .map((filename, i) => `    case "${filename.slice(0, -4)}": return src${i};`)
  .join("\n"),
);
s.push("  }");
s.push("}");

await write(outPath, s.join("\n"));

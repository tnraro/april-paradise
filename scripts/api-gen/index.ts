import { write } from "bun";
import { readdir } from "node:fs/promises";
import { join } from "path";

const apiRoot = join(import.meta.dir, "../../src/routes/api/");
const outPath = join(import.meta.dir, "../../src/lib/api/api.gen.ts");

let index = 0;

const imports: string[] = [];
const body: string[] = [];
const tree = {} as any;

const files = await readdir(apiRoot, { recursive: true });
for (const file of files) {
  if (!file.endsWith("+server.ts")) continue;
  const path = join(apiRoot, file);
  const ps = [
    ...file.matchAll(/(?<=(?:\/|^)\[)(?<param>[\w_-]+)(?=\])|(?<=\/|^)(?<seg>[\w_-]+)/g),
  ].map((x) => x.groups! as { param?: string; seg?: string });
  const ts = await Bun.file(path).text();
  const ms = [
    ...[
      ...ts.matchAll(
        /export\s+const\s+(GET|POST|PUT|DELETE)\s*=\s*route\s*\(|export\s+type\s+(GET|POST|PUT|DELETE)\s*=\s*typeof\s+\2/g,
      ),
    ].reduce((o, b) => {
      const x = b[1] != null ? b[1] : b[2];
      o.add(x);
      return o;
    }, new Set<string>()),
  ];
  imports.push(
    `import { ${ms.map((x) => `${x} as ${x}${index}`).join(", ")} } from "$routes/api/${file.slice(0, -3)}";`,
  );
  let node = tree;
  let hasParam = false;
  for (const { param, seg } of ps) {
    if (param) hasParam = true;
    const name = param ?? seg!;

    if (node[name] == null) node[name] = {};
    node = node[name];
  }
  const to = (M: string) => {
    const Mi = `${M}${index}`;
    const path = `/api/${file.slice(0, -11)}`;
    switch (M) {
      case "GET": {
        if (hasParam) {
          return `(params: ${Mi}["params"]) => req<${Mi}>("${M}", "${path}", params, undefined, _fetch)`;
        }
        return `() => req<${Mi}>("${M}", "${path}", {}, undefined, _fetch)`;
      }
      default: {
        if (hasParam) {
          return `(params: ${Mi}["params"], body: Parameters<typeof req<${Mi}>>[3]) => req<${Mi}>("${M}", "${path}", params, body, _fetch)`;
        }
        return `(body: Parameters<typeof req<${Mi}>>[3]) => req<${Mi}>("${M}", "${path}", {}, body, _fetch)`;
      }
    }
  };
  for (const M of ms) {
    const m = M.toLowerCase();
    node[m] = to(M);
  }
  index++;
}
imports.push(`import { req } from "./client";`);

const walk = (node: any, depth = 0) => {
  const indent = "  ".repeat(depth + 1);
  for (let [k, v] of Object.entries(node)) {
    const _k = /^[a-z_$][\w_$]*$/i.test(k) ? k : `"${k}"`;
    if (typeof v === "object") {
      body.push(`${indent}${_k}: {`);
      walk(v, depth + 1);
      body.push(`${indent}},`);
    } else {
      body.push(`${indent}${_k}: ${v},`);
    }
  }
};

body.push("export const api = (_fetch?: typeof fetch) => ({");
walk(tree);
body.push("});");

const gen = `${imports.join("\n")}

${body.join("\n")}`;

write(outPath, gen);

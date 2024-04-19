#!/usr/bin/env bun

import { $, env } from "bun";

const prod = env.NODE_ENV === "production" ?? false;

await $`git pull`;

const res = await $`edgedb -I ${prod ? "ap_prod" : "april_paradise"} migrate`;

const noChangeInEdgeDB = res.stderr
  .toString()
  .startsWith("Everything is up to date.");

try {
  await $`rm -r .svelte-kit/out`;
} catch (_) {}

await $`pnpm install`;

await $`pnpm generate:api`;

await $`pnpm generate:edgeql`;

await $`pnpm build`;

await $`docker compose build`;

if (noChangeInEdgeDB) {
  await $`docker compose down app`;
  await $`docker compose up -d app`;
} else {
  await $`docker compose down`;
  await $`docker compose up -d`;
}

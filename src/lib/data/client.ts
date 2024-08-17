import { env } from "$env/dynamic/private";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: env.PG_URL,
});
export type Client = typeof client;
export type Transaction = Parameters<
  Parameters<typeof client.transaction>[0]
>[0];
export const client = drizzle(pool);

export function single<T>(x: T[]): T | null {
  if (x.length === 0) return null;
  if (x.length === 1) return x[0];
  throw new Error("SQL result must be one or less", {
    cause: x,
  });
}

export function singleOnly<T>(x: T[]): T {
  if (x.length === 1) return x[0];
  throw new Error("SQL result must be one", {
    cause: x,
  });
}

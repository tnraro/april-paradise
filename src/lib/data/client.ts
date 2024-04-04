import { env } from "$env/dynamic/private";
import { createClient } from "edgedb";

export const client = createClient({
  tlsSecurity: "insecure",
  dsn: env.DSN,
});

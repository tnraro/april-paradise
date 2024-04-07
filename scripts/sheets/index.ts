import { env } from "bun";
import createClient from "edgedb";
import { updateSheets } from "./query/update-sheets.query";
import { fetch } from "./src/fetch";

const client = createClient({
  tlsSecurity: "insecure",
  dsn: env.EDGEDB_DSN,
});

const ranges = await fetch();

if (ranges) {
  await updateSheets(client, { data: ranges });
}

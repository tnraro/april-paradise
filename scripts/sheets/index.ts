import createClient from "edgedb";
import { updateSheets } from "./query/update-sheets.query";
import { fetch } from "./src/fetch";

const client = createClient();

const ranges = await fetch();

if (ranges) {
  await updateSheets(client, { data: ranges });
}

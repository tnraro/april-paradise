import { client } from "$lib/data/client";
import { staticData } from "$lib/data/schema";
import { sql } from "drizzle-orm";
import { setData } from "../sheets";
import { fetch } from "./fetch";

export const update = async () => {
  const ranges = await fetch();
  if (ranges) {
    await client
      .insert(staticData)
      .values(ranges)
      .onConflictDoUpdate({
        target: staticData.sheet,
        set: {
          sheet: sql`excluded.sheet`,
          data: sql`excluded.data`,
        },
      });
    setData(ranges);
  }
};

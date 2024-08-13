import { sql } from "drizzle-orm";
import { type Client, singleOnly } from "../client";
import { resources } from "../schema";
import { constraintError } from "../error/constraint-error";

export async function addResource(
  tx: Client,
  owner: string,
  key: string,
  value: number,
) {
  const res = singleOnly(
    await tx
      .insert(resources)
      .values({
        owner,
        key,
        value,
      })
      .onConflictDoUpdate({
        target: [resources.owner, resources.key],
        set: { value: sql`${resources.value} + excluded.value` },
      })
      .returning({
        id: resources.id,
        value: resources.value,
      }),
  );
  if (res.value < 0) constraintError("value_should_be_positive");
  return res;
}

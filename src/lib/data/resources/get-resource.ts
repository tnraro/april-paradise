import { and, eq } from "drizzle-orm";
import { type Client, single } from "../client";
import { resources } from "../schema";

export async function getResource(tx: Client, owner: string, key: string) {
  return (
    single(
      await tx
        .select({
          value: resources.value,
        })
        .from(resources)
        .where(and(eq(resources.owner, owner), eq(resources.key, key))),
    )?.value ?? 0
  );
}

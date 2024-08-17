import { and, eq } from "drizzle-orm";
import type { Client } from "../client";
import { items } from "../schema";

export async function getItemsByCategory(
  tx: Client,
  category: string,
  owner: string,
) {
  return await tx
    .select({
      category: items.category,
      key: items.key,
      quantity: items.quantity,
    })
    .from(items)
    .where(and(eq(items.owner, owner), eq(items.category, category)));
}

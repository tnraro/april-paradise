import { groupBy } from "$lib/shared/util/group-by";
import { and, eq, gt } from "drizzle-orm";
import type { Client } from "../client";
import { items } from "../schema";

export async function getInventory(tx: Client, owner: string) {
  const res = await tx
    .select({
      key: items.key,
      category: items.category,
      quantity: items.quantity,
    })
    .from(items)
    .where(and(eq(items.owner, owner), gt(items.quantity, 0)));
  const map = groupBy(res, (x) => x.category);
  return Array.from(map, ([category, items]) => ({ category, items }));
}

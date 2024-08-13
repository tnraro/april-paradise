import { client } from "$lib/data/client";
import { items } from "$lib/data/schema";
import { eq } from "drizzle-orm";

export async function getInventory(owner: string, filters: Set<string>) {
  const res = await client
    .select({
      key: items.key,
      quantity: items.quantity,
    })
    .from(items)
    .where(eq(items.owner, owner));
  return res
    .filter((x) => filters.has(x.key))
    .reduce(
      (o, item) => {
        o[item.key] = item.quantity;
        return o;
      },
      {} as Record<string, number>,
    );
}

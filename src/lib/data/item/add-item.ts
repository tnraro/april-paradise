import { sql } from "drizzle-orm";
import { type Client, singleOnly } from "../client";
import { items } from "../schema";
import { constraintError } from "../error/constraint-error";

export async function addItem(
  tx: Client,
  category: string,
  owner: string,
  key: string,
  quantity: number,
) {
  const res = singleOnly(
    await tx
      .insert(items)
      .values({
        owner,
        category,
        key,
        quantity,
      })
      .onConflictDoUpdate({
        target: [items.owner, items.category, items.key],
        set: {
          quantity: sql`${items.quantity} + excluded.quantity`,
        },
      })
      .returning({
        id: items.id,
        quantity: items.quantity,
      }),
  );
  if (res.quantity < 0) constraintError("quantity_should_be_positive");
  return res;
}

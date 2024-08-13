import { eq, sql } from "drizzle-orm";
import { type Client, singleOnly } from "../client";
import { constraintError } from "../error/constraint-error";
import { users } from "../schema";

export async function addChips(tx: Client, id: string, value = 1) {
  if (value === 0) return null;
  const res = singleOnly(
    await tx
      .update(users)
      .set({
        chips: sql`${users.chips} + ${value}`,
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        chips: users.chips,
      }),
  );
  if (res.chips < 0) constraintError("chips_should_be_positive");
  return res;
}

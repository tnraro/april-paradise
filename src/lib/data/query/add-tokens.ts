import { eq, sql } from "drizzle-orm";
import { type Client, singleOnly } from "../client";
import { constraintError } from "../error/constraint-error";
import { users } from "../schema";

export async function addTokens(tx: Client, id: string, value = 1) {
  if (value === 0) return null;
  const res = singleOnly(
    await tx
      .update(users)
      .set({
        tokens: sql`${users.tokens} + ${value}`,
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        tokens: users.tokens,
      }),
  );
  if (res.tokens < 0) constraintError("tokens_should_be_positive");
  return res;
}

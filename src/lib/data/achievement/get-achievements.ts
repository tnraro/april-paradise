import { eq } from "drizzle-orm";
import type { Client } from "../client";
import { achievements } from "../schema";

export async function getAchievements(tx: Client, user: string) {
  return await tx
    .select({
      key: achievements.key,
    })
    .from(achievements)
    .where(eq(achievements.key, user));
}

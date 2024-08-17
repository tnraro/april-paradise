import type { Client } from "../client";
import { achievements } from "../schema";

export async function addAchievements(
  tx: Client,
  user: string,
  keys: string[],
) {
  await tx
    .insert(achievements)
    .values(keys.map((key) => ({ user, key })))
    .onConflictDoNothing({
      target: [achievements.user, achievements.key],
    });
}

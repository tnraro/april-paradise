import { type Client, client } from "$lib/data/client.js";
import { getItemsByCategory } from "$lib/data/item/get-items-by-category.js";
import { achievements, items } from "$lib/data/schema.js";
import {
  getAchievementData,
  getFishingData,
  getLureData,
} from "$lib/data/sheets/sheets.js";
import { isScheduleActived } from "$lib/data/sheets/utils";
import { redirect } from "@sveltejs/kit";
import { and, eq, inArray } from "drizzle-orm";

export const load = async ({ locals }) => {
  if (!(await isScheduleActived("낚시"))) {
    redirect(303, "/");
  }
  const user = locals.user;
  if (user == null || user.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  return await client.transaction(async (tx) => {
    const [_, lureData, fishData, achievementData] = await Promise.all([
      (async () => {
        const { lure0, lure1, lure2 } = await getLures(tx, user.id);
        const items = await getItemsByCategory(tx, "fish", user.id);

        return {
          lures: {
            "까만 콩 지렁이": lure0,
            "토깽이 떡밥": lure1,
            "사우루숭 벌레 유충": lure2,
          },
          items,
          achievements: await getAchievements(tx, user.id),
        };
      })(),
      getLureData(),
      getFishingData(),
      getAchievementData(),
    ]);
    return {
      lures: _.lures,
      items: _.items,
      achievements: _.achievements,
      lureData,
      fishData,
      achievementData,
    };
  });
};

async function getAchievements(tx: Client, userId: string) {
  return await tx
    .select({
      key: achievements.key,
      createdAt: achievements.createdAt,
    })
    .from(achievements)
    .where(eq(achievements.user, userId));
}

async function getLures(tx: Client, owner: string) {
  const res = await tx
    .select({
      key: items.key,
      quantity: items.quantity,
    })
    .from(items)
    .where(
      and(
        eq(items.owner, owner),
        inArray(items.key, [
          "까만 콩 지렁이",
          "토깽이 떡밥",
          "사우루숭 벌레 유충",
        ]),
      ),
    );
  return res.reduce(
    (acc, { key, quantity }) => {
      acc[`lure${lureIdBy(key)}`] = quantity;
      return acc;
    },
    { lure0: 0, lure1: 0, lure2: 0 } as { [K in `lure${0 | 1 | 2}`]: number },
  );

  function lureIdBy(key: string): 0 | 1 | 2 {
    switch (key) {
      case "까만 콩 지렁이":
        return 0;
      case "토깽이 떡밥":
        return 1;
      case "사우루숭 벌레 유충":
        return 2;
    }
    throw new Error(`unexpected lure key: ${key}`);
  }
}

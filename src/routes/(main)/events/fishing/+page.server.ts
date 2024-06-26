import {
  getAchievementData,
  getFishingData,
  getLureData,
} from "$lib/data/sheets/sheets.js";
import { isScheduleActived } from "$lib/data/sheets/utils";
import { redirect } from "@sveltejs/kit";
import { achievements } from "./achievements.query.js";
import { bowl } from "./bowl.query.js";
import { lures } from "./lures.query.js";

export const load = async ({ locals }) => {
  if (!(await isScheduleActived("낚시"))) {
    redirect(303, "/");
  }
  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  return await locals.client.transaction(async (tx) => {
    const [_, lureData, fishData, achievementData] = await Promise.all([
      (async () => {
        const { lure0, lure1, lure2 } = await lures(tx);
        const items = await bowl(tx, { category: "fish" });

        return {
          lures: {
            "까만 콩 지렁이": lure0,
            "토깽이 떡밥": lure1,
            "사우루숭 벌레 유충": lure2,
          },
          items,
          achievements: await achievements(tx),
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

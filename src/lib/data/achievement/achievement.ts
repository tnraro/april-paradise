import { groupBy } from "$lib/shared/util/group-by";
import type { Executor } from "edgedb";
import { FishingGrade } from "../sheets/model";
import { getFishingData } from "../sheets/sheets";
import { getAchievements } from "./get-achievements.query";
import { getFishes } from "./get-fishes.query";

export const onCaughtFish = async (client: Executor, fishKey: string) => {
  const achievementSet = new Set(await getAchievements(client));

  if (fishKey.startsWith("losing-")) {
    if (achievementSet.has("achievement-11")) return [];
    const garbages = await getFishes(client, {
      category: "garbage",
    });
    const sum = garbages.reduce((sum, garbage) => sum + garbage.quantity, 0);
    if (sum === 10) {
      // 이게 진짜일 리 없어
      return ["achievement-11"];
    }
  } else {
    const [fishingData] = await Promise.all([getFishingData()]);
    const fishingDataMap = new Map(fishingData.map((x) => [x.key, x]));
    const fishes = await getFishes(client, {
      category: "fish",
    });
    const fishMap = new Map(fishes.map((fish) => [fish.key, fish.quantity]));
    const sum = fishes.reduce((sum, fish) => sum + fish.quantity, 0);

    const keys = [
      "achievement-0",
      "achievement-1",
      "achievement-2",
      "achievement-3",
      "achievement-4",
      "achievement-5",
      "achievement-6",
      "achievement-7",
      "achievement-8",
      "achievement-9",
      "achievement-10",
    ] as const;
    const achievements: string[] = [];
    const check = (key: (typeof keys)[keyof typeof keys]) => {
      switch (key) {
        case "achievement-0":
          // 이제 시작
          return sum === 10;
        case "achievement-1":
          // 낚시는 즐거워
          return sum === 50;
        case "achievement-2": {
          // 럭키 데이
          const grade = fishingDataMap.get(fishKey)?.grade ?? 0;
          if (grade < FishingGrade.Legendary) return false;
          const targetFishes = groupBy(
            fishes,
            (x) => `${fishingDataMap.get(x.key)?.grade ?? 0}`,
          );
          return (
            (targetFishes.get(`${FishingGrade.Legendary}`)?.length ?? 0) >= 5 &&
            (targetFishes.get(`${FishingGrade.Mythic}`)?.length ?? 0) >= 5
          );
        }
        case "achievement-3": {
          // 강태공
          const fishSet = new Set(
            fishingData
              .filter((x) => x.key.startsWith("fish-"))
              .map((x) => x.key),
          );
          return fishes.length === fishSet.size;
        }
        case "achievement-4":
          // 반짝반짝
          return fishKey === "fish-1";
        case "achievement-5":
          // 꽉
          return fishKey === "fish-9";
        case "achievement-6":
          // 백악기 물고기?
          return fishKey === "fish-20";
        case "achievement-7":
          // 왹
          return fishKey === "fish-0";
        case "achievement-8":
          // 거대한 도마뱀
          return fishKey === "fish-18";
        case "achievement-9":
          // 바다의 제왕
          return fishKey === "fish-19";
        case "achievement-10":
          // 너무 좋아해!
          return fishMap.get(fishKey) === 10;
      }
    };
    for (const key of keys) {
      if (check(key)) {
        if (achievementSet.has(key)) continue;
        achievements.push(key);
      }
    }
    return achievements;
  }
  return [];
};

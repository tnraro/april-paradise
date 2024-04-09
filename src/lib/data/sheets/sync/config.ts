import type {
  AchievementData,
  CocktailNpcData,
  CocktailStoreData,
  FishingData,
  IndexData,
  ItemData,
  LureData,
  RouletteData,
  RunnerData,
  ScheduleData,
} from "../model";
import { parse } from "./parse";
import { type Raw, c } from "./utils";

export const config = {
  sheets: [
    {
      sheet: "index",
      range: "A1:B",
      map: (row: IndexData): IndexData => row,
    },
    c("일정", "A1:G", (row: Raw<ScheduleData>) => ({
      key: parse(row.key).string().unwrap(),
      pathname: parse(row.pathname).string().unwrap(),
      title: parse(row.title).string().unwrap(),
      description: parse(row.description).string().unwrap(),
      start: parse(row.start).date().unwrap(),
      end: parse(row.end).date().unwrap(),
    })),
    c("룰렛", "A1:D", (row: Raw<RouletteData>) => ({
      key: parse(row.key).string().unwrap(),
      result: parse(row.result).money().item().unwrap(),
      probability: parse(row.probability).number().unwrap(),
    })),
    c("낚시업적", "A1:E", (row: Raw<AchievementData>) => ({
      key: parse(row.key).string().unwrap(),
      name: parse(row.name).string().unwrap(),
      condition: parse(row.condition).string().unwrap(),
      reward: parse(row.reward).money().unwrap(),
      isHidden: parse(row.isHidden).boolean().unwrap(),
    })),
    c("낚시", "A1:M", (row: Raw<FishingData>) => ({
      key: parse(row.key).string().unwrap(),
      lure: parse(row.lure).string().unwrap(),
      name: parse(row.name).string().unwrap(),
      grade: parse(row.grade).grade().unwrap(),
      probability: parse(row.probability).number().unwrap(),
      hp: parse(row.hp).number().unwrap(),
      power: parse(row.power).number().unwrap(),
      rampancy: parse(row.rampancy).number().unwrap(),
      endurance: parse(row.endurance).number().unwrap(),
      catchphrase: parse(row.catchphrase).string().unwrap(),
      description: parse(row.description).string().unwrap(),
      exception: parse(row.exception).string().unwrap(),
    })),
    c("미끼상점", "A1:F", (row: Raw<LureData>) => ({
      key: parse(row.key).string().unwrap(),
      name: parse(row.name).string().unwrap(),
      price: parse(row.price).money().unwrap(),
    })),
    {
      sheet: "칵테일NPC",
      range: "A6:F",
      map: (
        row: Record<
          | "key"
          | "npc"
          | "loveCocktail"
          | "loveIngredients"
          | "likeCocktail"
          | "likeIngredients",
          string
        >,
      ): CocktailNpcData => ({
        key: parse(row.key).string().unwrap(),
        npc: parse(row.npc).string().unwrap(),
        love: {
          name: parse(row.loveCocktail).string().unwrap(),
          ingredients: parse(row.loveIngredients).ingredients().unwrap(),
        },
        like: {
          name: parse(row.likeCocktail).string().unwrap(),
          ingredients: parse(row.likeIngredients).ingredients().unwrap(),
        },
      }),
    },
    c("칵테일상점", "A1:D", (row: Raw<CocktailStoreData>) => ({
      key: parse(row.key).string().unwrap(),
      name: parse(row.name).string().unwrap(),
      isSpecial: parse(row.isSpecial).boolean().unwrap(),
      price: parse(row.price).money().unwrap(),
    })),
    c("러너", "A1:G", (row: Raw<RunnerData>) => ({
      key: parse(row.key).string().unwrap(),
      name: parse(row.name).string().unwrap(),
      twitterId: parse(row.twitterId).string().unwrap(),
      height: parse(row.height).number().unwrap(),
      weight: parse(row.weight).number().unwrap(),
      gender: parse(row.gender).string().unwrap(),
    })),
    c("아이템", "A1:D", (row: Raw<ItemData>) => ({
      key: parse(row.key).string().unwrap(),
      name: parse(row.name).string().unwrap(),
      category: parse(row.category).string().unwrap(),
      description: parse(row.description).string().unwrap(),
    })),
  ],
};

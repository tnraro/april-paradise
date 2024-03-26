import { env } from "$env/dynamic/private";
import { cacheFn } from "$lib/data/cache/cache-fn";
import { auth, sheets } from "@googleapis/sheets";
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
} from "./model";
import { parse } from "./parse";

const googleSheets = sheets({
  version: "v4",
  auth: new auth.JWT(
    env.SHEETS_CLIENT_EMAIL,
    undefined,
    env.SHEETS_PRIVATE_KEY,
    ["https://www.googleapis.com/auth/spreadsheets"],
  ),
});

type Raw<T> = Record<keyof T, string | null>;
export const getData = cacheFn(
  60,
  async <T>(sheet: string, range: string): Promise<Raw<T>[]> => {
    const context = await googleSheets.spreadsheets.values.get({
      spreadsheetId: env.SHEETS_ID,
      range: `${sheet}!${range}`,
    });

    if (context.data.values == null) throw { message: "empty" };

    const titles = context.data.values[0];
    const rows = context.data.values.slice(1);

    return rows.map((row) =>
      titles.reduce(
        (o, key, i) => {
          const value = row[i]?.trim();
          o[key] = value ? value : null;
          return o;
        },
        {} as Raw<T>,
      ),
    );
  },
);

export const getIndexData = async (): Promise<IndexData[]> => {
  const data = await getData<IndexData>("index", "A1:B");
  return data as IndexData[];
};

export const getScheduleData = async (): Promise<ScheduleData[]> => {
  const data = await getData<ScheduleData>("일정", "A1:G");
  return data.map((row) => ({
    key: parse(row.key).string().unwrap(),
    pathname: parse(row.pathname).string().unwrap(),
    title: parse(row.title).string().unwrap(),
    description: parse(row.description).string().unwrap(),
    start: parse(row.start).date().unwrap(),
    end: parse(row.end).date().unwrap(),
  }));
};

export const getRouletteData = async (): Promise<RouletteData[]> => {
  const data = await getData<RouletteData>("룰렛", "A1:D");
  return data.map((row) => ({
    key: parse(row.key).string().unwrap(),
    result: parse(row.result).money().item().unwrap(),
    probability: parse(row.probability).number().unwrap(),
  }));
};

export const getAchievementData = async (): Promise<AchievementData[]> => {
  const data = await getData<AchievementData>("낚시업적", "A1:E");
  return data.map((row) => ({
    key: parse(row.key).string().unwrap(),
    name: parse(row.name).string().unwrap(),
    condition: parse(row.condition).string().unwrap(),
    reward: parse(row.reward).money().unwrap(),
    isHidden: parse(row.isHidden).boolean().unwrap(),
  }));
};

export const getFishingData = async (): Promise<FishingData[]> => {
  const data = await getData<FishingData>("낚시", "A1:M");
  return data.map((row) => ({
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
  }));
};

export const getLureData = async (): Promise<LureData[]> => {
  const data = await getData<LureData>("미끼상점", "A1:F");
  return data.map((row) => ({
    key: parse(row.key).string().unwrap(),
    name: parse(row.name).string().unwrap(),
    price: parse(row.price).money().unwrap(),
  }));
};

export const getCocktailNpcData = async (): Promise<CocktailNpcData[]> => {
  const data = await getData<
    Record<
      | "key"
      | "npc"
      | "loveCocktail"
      | "loveIngredients"
      | "likeCocktail"
      | "likeIngredients",
      string
    >
  >("칵테일NPC", "A6:F");
  return data.map((row) => ({
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
  }));
};

export const getCocktailStoreData = async (): Promise<CocktailStoreData[]> => {
  const data = await getData<CocktailStoreData>("칵테일상점", "A1:D");
  return data.map((row) => ({
    key: parse(row.key).string().unwrap(),
    name: parse(row.name).string().unwrap(),
    isSpecial: parse(row.isSpecial).boolean().unwrap(),
    price: parse(row.price).money().unwrap(),
  }));
};

export const getRunnerData = async (): Promise<RunnerData[]> => {
  const data = await getData<RunnerData>("러너", "A1:F");
  return data.map((row) => ({
    key: parse(row.key).string().unwrap(),
    name: parse(row.name).string().unwrap(),
    twitterId: parse(row.twitterId).string().unwrap(),
    height: parse(row.height).number().unwrap(),
    weight: parse(row.weight).number().unwrap(),
    gender: parse(row.gender).string().unwrap(),
  }));
};

export const getItemData = async (): Promise<ItemData[]> => {
  const data = await getData<ItemData>("아이템", "A1:D");
  return data.map((row) => ({
    key: parse(row.key).string().unwrap(),
    name: parse(row.name).string().unwrap(),
    category: parse(row.category).string().unwrap(),
    description: parse(row.description).string().unwrap(),
  }));
};

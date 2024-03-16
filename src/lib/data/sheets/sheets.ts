import { env } from "$env/dynamic/private";
import { auth, sheets } from "@googleapis/sheets";
import type {
  AchievementData,
  CocktailNpcData,
  CocktailStoreData,
  FishingData,
  IndexData,
  LureData,
  RouletteData,
  ScheduleData,
} from "./model";
import { parse } from "./parse";

const googleSheets = sheets({
  version: "v4",
  auth: new auth.JWT(env.SHEETS_CLIENT_EMAIL, undefined, env.SHEETS_PRIVATE_KEY, [
    "https://www.googleapis.com/auth/spreadsheets",
  ]),
});

type Raw<T> = Record<keyof T, string | null>;
export const getData = async <T>(sheet: string, range: string): Promise<Raw<T>[]> => {
  const context = await googleSheets.spreadsheets.values.get({
    spreadsheetId: env.SHEETS_ID,
    range: `${sheet}!${range}`,
  });

  if (context.data.values == null) throw { message: "empty" };

  const titles = context.data.values[0];
  const rows = context.data.values.slice(1);

  return rows.map((row) =>
    titles.reduce((o, key, i) => {
      const value = row[i]?.trim();
      o[key] = value ? value : null;
      return o;
    }, {} as Raw<T>),
  );
};

export const getIndexData = async (): Promise<IndexData[]> => {
  const data = await getData<IndexData>("index", "A1:B");
  return data as IndexData[];
};

export const getScheduleData = async (): Promise<ScheduleData[]> => {
  const data = await getData<ScheduleData>("일정", "A1:C");
  return data.map((row) => ({
    key: row.key!,
    start: parse(row.start).date().unwrap(),
    end: parse(row.end).date().unwrap(),
  }));
};

export const getRouletteData = async (): Promise<RouletteData[]> => {
  const data = await getData<RouletteData>("룰렛", "A1:C");
  return data.map((row) => ({
    key: row.key!,
    result: parse(row.result!).money().item().unwrap()!,
    probability: parse(row.probability!).number().unwrap()!,
  }));
};

export const getAchievementData = async (): Promise<AchievementData[]> => {
  const data = await getData<AchievementData>("낚시업적", "A1:E");
  return data.map((row) => ({
    key: row.key!,
    name: row.name!,
    condition: row.condition!,
    reward: parse(row.reward).money().unwrap()!,
    isHidden: parse(row.isHidden).boolean().unwrap()!,
  }));
};

export const getFishingData = async (): Promise<FishingData[]> => {
  const data = await getData<FishingData>("낚시", "A1:G");
  return data.map((row) => ({
    key: row.key!,
    lure: row.lure!,
    name: row.name!,
    grade: parse(row.grade).grade().unwrap()!,
    probability: parse(row.probability).number().unwrap()!,
    catchphrase: row.catchphrase!,
    description: row.description!,
  }));
};

export const getLureData = async (): Promise<LureData[]> => {
  const data = await getData<LureData>("미끼상점", "A1:F");
  return data.map((row) => ({
    key: row.key!,
    name: row.name!,
    price: parse(row.price).money().unwrap()!,
  }));
};

export const getCocktailNpcData = async (): Promise<CocktailNpcData[]> => {
  const data = await getData<
    Record<
      "key" | "npc" | "loveCocktail" | "loveIngredients" | "likeCocktail" | "likeIngredients",
      string
    >
  >("칵테일NPC", "A6:F");
  return data.map((row) => ({
    key: row.key!,
    npc: row.npc!,
    love: {
      name: row.loveCocktail!,
      ingredients: parse(row.loveIngredients).ingredients().unwrap()!,
    },
    like: {
      name: row.likeCocktail!,
      ingredients: parse(row.likeIngredients).ingredients().unwrap()!,
    },
  }));
};

export const getCocktailStoreData = async (): Promise<CocktailStoreData[]> => {
  const data = await getData<CocktailStoreData>("칵테일상점", "A1:D");
  return data.map((row) => ({
    key: row.key!,
    name: row.name!,
    isSpecial: parse(row.isSpecial).boolean().unwrap()!,
    price: parse(row.price).money().unwrap()!,
  }));
};

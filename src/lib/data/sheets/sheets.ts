import { parse } from "devalue";
import type { Executor } from "edgedb";
import type {
  AchievementData,
  CocktailIngredientData,
  CocktailNpcData,
  CocktailRouteData,
  CocktailStoreData,
  FishingData,
  IndexData,
  ItemData,
  LureData,
  RouletteData,
  RunnerData,
  ScheduleData,
  StoreData,
} from "./model";
import { queryData } from "./query-data.query";

let m = new Map<string, unknown[]>();

export const initData = async (client: Executor) => {
  const data = await queryData(client);
  m = new Map(data.map((x) => [x.sheet, parse(x.data)]));
};

export const setData = (ranges: { sheet: string; data: unknown[] }[]) => {
  m = new Map(ranges.map((x) => [x.sheet, x.data]));
};

export const getData = async <T>(sheet: string): Promise<T[]> => {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return m.get(sheet)! as T[];
};

export const getIndexData = async (): Promise<IndexData[]> => {
  return await getData<IndexData>("index");
};

export const getScheduleData = async (): Promise<ScheduleData[]> => {
  return await getData<ScheduleData>("일정");
};

export const getRouletteData = async (): Promise<RouletteData[]> => {
  return await getData<RouletteData>("룰렛");
};

export const getAchievementData = async (): Promise<AchievementData[]> => {
  return await getData<AchievementData>("낚시업적");
};

export const getFishingData = async (): Promise<FishingData[]> => {
  return await getData<FishingData>("낚시");
};

export const getLureData = async (): Promise<LureData[]> => {
  return await getData<LureData>("미끼상점");
};

export const getCocktailNpcData = async (): Promise<CocktailNpcData[]> => {
  return await getData<CocktailNpcData>("칵테일NPC");
};

export const getCocktailStoreData = async (): Promise<CocktailStoreData[]> => {
  return await getData<CocktailStoreData>("칵테일상점");
};

export const getRunnerData = async (): Promise<RunnerData[]> => {
  return await getData<RunnerData>("러너");
};

export const getItemData = async (): Promise<ItemData[]> => {
  return await getData<ItemData>("아이템");
};

export const getStoreData = async (): Promise<StoreData[]> => {
  return await getData<StoreData>("통합상점");
};

export const getCocktailRouteData = async (): Promise<CocktailRouteData[]> => {
  return await getData<CocktailRouteData>("칵테일루트");
};

export const getCocktailIngredientData = async (): Promise<
  CocktailIngredientData[]
> => {
  return await getData<CocktailIngredientData>("칵테일확률");
};

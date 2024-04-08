import type {
  AchievementData,
  CocktailNpcData,
  CocktailStoreData,
  FishingData,
  ItemData,
  LureData,
} from "$lib/data/sheets/model";

const createSingletonData = <T>() => {
  let data = $state<T>();

  return (initial?: T) => {
    if (initial != null) {
      data = initial;
    }
    return {
      get data() {
        return data;
      },
    };
  };
};

export const useAchievementData = createSingletonData<AchievementData[]>();
export const useFishingData = createSingletonData<FishingData[]>();
export const useLureData = createSingletonData<LureData[]>();
export const useCocktailNpcData = createSingletonData<CocktailNpcData[]>();
export const useCocktailStoreData = createSingletonData<CocktailStoreData[]>();
export const useItemData = createSingletonData<ItemData[]>();

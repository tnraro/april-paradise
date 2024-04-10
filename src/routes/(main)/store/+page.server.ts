import { getStoreData } from "$lib/data/sheets/sheets";

export const load = async () => {
  const storeData = await getStoreData();
  // 아이템 교환권 개수
  // 스톡이 있는 아이템들 개수

  return {
    storeData,
  };
};

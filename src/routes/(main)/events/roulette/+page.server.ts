import { getRouletteData } from "$lib/data/sheets/sheets";

export const load = async () => {
  const rouletteData = await getRouletteData();
  return {
    rouletteData,
  };
};

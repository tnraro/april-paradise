import { getRouletteData } from "$lib/data/sheets/sheets";

export const load = async () => {
  return {
    data: await getRouletteData(),
  };
};

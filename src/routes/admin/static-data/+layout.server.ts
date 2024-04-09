import { env } from "$env/dynamic/private";
import { getIndexData } from "$lib/data/sheets/sheets";

export const load = async () => {
  const index = await getIndexData();

  return {
    sheetsUrl: env.SHEETS_URL,
    index,
  };
};

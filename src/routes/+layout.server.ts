import { getNoticeData } from "$lib/data/sheets/sheets.js";

export const load = async () => {
  const notices = await getNoticeData();

  return {
    notices,
  };
};

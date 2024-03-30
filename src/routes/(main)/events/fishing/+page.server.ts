import { getLureData } from "$lib/data/sheets/sheets.js";
import { isScheduleActived } from "$lib/data/sheets/utils";
import { redirect } from "@sveltejs/kit";
import { page } from "./page.query.js";

export const load = async ({ locals }) => {
  if (!(await isScheduleActived("낚시"))) {
    redirect(303, "/");
  }
  if (!(await locals.auth.session.isSignedIn())) {
    redirect(303, "/auth/sign-in");
  }
  const { lure0, lure1, lure2 } = await page(locals.client);
  const lureData = await getLureData();
  return {
    lures: {
      "까만 콩 지렁이": lure0,
      "토깽이 떡밥": lure1,
      "사우루숭 벌레 유충": lure2,
    },
    lureData,
  };
};

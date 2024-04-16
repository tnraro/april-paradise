import { getRouletteData } from "$lib/data/sheets/sheets";
import { isScheduleActived } from "$lib/data/sheets/utils";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (!(await isScheduleActived("룰렛"))) {
    redirect(303, "/");
  }
  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }

  const rouletteData = await getRouletteData();
  return {
    rouletteData,
  };
};

import { getRouletteData } from "$lib/data/sheets/sheets";
import { isScheduleActived } from "$lib/data/sheets/utils";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (!(await isScheduleActived("룰렛"))) {
    redirect(303, "/");
  }
  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }

  const rouletteData = await getRouletteData();
  return {
    rouletteData,
  };
};

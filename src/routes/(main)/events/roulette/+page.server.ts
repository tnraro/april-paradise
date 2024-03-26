import { getRouletteData } from "$lib/data/sheets/sheets";
import { isScheduleActived } from "$lib/data/sheets/utils";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (!(await isScheduleActived("룰렛"))) {
    redirect(303, "/");
  }
  if (!(await locals.auth.session.isSignedIn())) {
    redirect(303, "/auth/sign-in");
  }

  const rouletteData = await getRouletteData();
  return {
    rouletteData,
  };
};

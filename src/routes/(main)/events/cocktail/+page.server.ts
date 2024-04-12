import { getCocktailRouteData } from "$lib/data/sheets/sheets.js";
import { isScheduleActived } from "$lib/data/sheets/utils";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (!(await isScheduleActived("칵테일"))) {
    redirect(303, "/");
  }
  if (!(await locals.auth.session.isSignedIn())) {
    redirect(303, "/auth/sign-in");
  }
  const routeData = await getCocktailRouteData();

  return {
    routeData,
  };
};

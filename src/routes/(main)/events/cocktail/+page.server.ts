import { getCocktailRouteData } from "$lib/data/sheets/sheets.js";
import { isScheduleActived } from "$lib/data/sheets/utils";
import { redirect } from "@sveltejs/kit";
import { page } from "./page.query.js";

export const load = async ({ locals }) => {
  if (!(await isScheduleActived("칵테일"))) {
    redirect(303, "/");
  }
  if (locals.currentUser == null || locals.currentUser.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  const routeData = await getCocktailRouteData();
  const places = await page(locals.client);
  const visiteds = places.reduce(
    (o, x) => {
      const m = x
        .match(/^cocktail-place-(탐색|조사)-([^-]+)-([^-]+)$/)
        ?.slice(1);
      if (m == null) return o;
      const [type, title, key] = m;
      o.push({
        type,
        title,
        key,
      });
      return o;
    },
    [] as { type: string; title: string; key: string }[],
  );

  return {
    routeData,
    visiteds,
  };
};

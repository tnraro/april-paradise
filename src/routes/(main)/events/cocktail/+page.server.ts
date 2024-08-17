import { client } from "$lib/data/client.js";
import { resources } from "$lib/data/schema.js";
import { getCocktailRouteData } from "$lib/data/sheets/sheets.js";
import { isScheduleActived } from "$lib/data/sheets/utils";
import { redirect } from "@sveltejs/kit";
import { and, eq, like } from "drizzle-orm";

export const load = async ({ locals }) => {
  if (!(await isScheduleActived("칵테일"))) {
    redirect(303, "/");
  }
  if (locals.user == null || locals.user.isBanned) {
    redirect(303, "/auth/sign-in");
  }
  const routeData = await getCocktailRouteData();
  const places = await getPlaces(locals.user.id);
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

async function getPlaces(owner: string) {
  const res = await client
    .select({
      key: resources.key,
    })
    .from(resources)
    .where(
      and(eq(resources.owner, owner), like(resources.key, "cocktail-place-%")),
    );
  return res.map((x) => x.key);
}

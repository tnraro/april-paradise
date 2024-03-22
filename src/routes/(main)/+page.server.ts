import { getScheduleData } from "$lib/data/sheets/sheets";

export const load = async () => {
  const schedule = await getScheduleData();
  const now = Date.now();

  return {
    schedule: schedule
      .filter(
        (event) =>
          event.pathname != null &&
          now >= (event.start?.getTime() ?? 0) &&
          now <= (event.end?.getTime() ?? 0),
      )
      .toSorted((a, b) => a.end.getTime() - b.end.getTime()),
  };
};

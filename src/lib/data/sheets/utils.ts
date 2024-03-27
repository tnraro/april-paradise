import { groupBy } from "$lib/shared/util/group-by";
import { getRunnerData, getScheduleData } from "./sheets";

export const isScheduleActived = async (key: string) => {
  const scheduleData = await getScheduleData();
  const schedule = scheduleData.find((x) => key === x.key);
  if (schedule == null) return false;
  const now = new Date();
  const isActived = now >= schedule.start && now <= schedule.end;
  return isActived;
};
export const isScheduleStarted = async (key: string) => {
  const scheduleData = await getScheduleData();
  const schedule = scheduleData.find((x) => key === x.key);
  if (schedule == null) return false;
  const now = new Date();
  const isStarted = now >= schedule.start;
  return isStarted;
};

export const wrapRunnerData = async <T extends { key: string }>(
  x: T | null | undefined | Promise<T | null | undefined>,
) => {
  const _x = await x;
  if (_x == null) return null;
  const runners = await getRunnerData();
  const runner = runners.find((runner) => runner.key === _x.key);
  if (runner == null) return null;
  return {
    ..._x,
    ...runner,
  };
};

export const wrapRunners = async <T extends { key: string }>(
  xs: T[] | Promise<T[]>,
) => {
  const data = groupBy(await getRunnerData(), (x) => x.key);
  return (await xs).map((x) => ({
    ...x,
    ...data.get(x.key)?.[0],
  }));
};

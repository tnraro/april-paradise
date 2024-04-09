import { groupBy } from "$lib/shared/util/group-by";
import type { RunnerData } from "./model";
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

/**
 * @deprecated use wrapUser
 */
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

/**
 * @deprecated use wrapUsers
 */
export const wrapRunners = async <T extends { key: string }>(
  xs: T[] | Promise<T[]>,
) => {
  const data = groupBy(await getRunnerData(), (x) => x.key);
  return (await xs).map((x) => ({
    ...x,
    ...data.get(x.key)?.[0],
  }));
};

export const wrapUser = async <T extends { key: string; isAdmin: boolean }>(
  x: T | null | undefined | Promise<T | null | undefined>,
): Promise<
  | (T & { isAdmin: true } & { name: string })
  | (T & { isAdmin: false } & RunnerData)
  | null
> => {
  const user = await x;
  if (user == null) return null;
  if (user.isAdmin) {
    return {
      ...(user as T & { isAdmin: true }),
      name: user.key,
    };
  }
  const runners = await getRunnerData();
  const runner = runners.find((runner) => runner.key === user.key);
  if (runner == null) {
    console.warn("no runner:", user.key);
    return null;
  }
  return {
    ...user,
    ...runner,
  };
};

export const wrapUsers = async <T extends { key: string; isAdmin: boolean }>(
  xs: T[] | Promise<T[]>,
) => {
  const data = groupBy(await getRunnerData(), (x) => x.key);
  return (await xs).map(
    (
      x,
    ):
      | (T & { isAdmin: true } & { name: string })
      | (T & { isAdmin: false } & Partial<RunnerData>) => {
      if (x.isAdmin) {
        return {
          ...(x as T & { isAdmin: true }),
          name: x.key,
        };
      }
      let runner = data.get(x.key)?.[0];
      if (runner == null) {
        console.warn("no runner:", x.key);
      }
      return {
        ...(x as T & { isAdmin: false }),
        ...runner,
      };
    },
  );
};

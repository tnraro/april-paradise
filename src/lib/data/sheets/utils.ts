import { getScheduleData } from "./sheets";

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

import { api } from "$lib/api/api.gen.js";
import { sendError } from "$lib/ui/error/send-error.js";

export const load = async ({ fetch }) => {
  const res = await api(fetch).runners.attendance.get();
  if (!res.ok) {
    sendError(res.error.message);
    return {};
  }
  return {
    attendance: res.data.today,
  };
};

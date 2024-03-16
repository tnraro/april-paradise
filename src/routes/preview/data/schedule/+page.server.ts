import { api } from "$lib/api/api.gen";
import { error } from "@sveltejs/kit";

export const load = async ({ fetch }) => {
  const res = await api(fetch).data.schedule.get();
  if (res.ok) {
    return {
      data: res.data.map((row) => ({
        ...row,
        start: row.start ? new Date(row.start) : null,
        end: row.end ? new Date(row.end) : null,
      })),
    };
  }
  console.error(res.error);
  error(500, res.error.message);
};

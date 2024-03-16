import { api } from "$lib/api/api.gen";
import { error } from "@sveltejs/kit";

export const load = async ({ fetch }) => {
  const res = await api(fetch).data["lure-store"].get();
  if (res.ok) {
    return {
      data: res.data,
    };
  }
  console.error(res.error);
  error(500, res.error.message);
};

import { api } from "$lib/api/api.gen";
import { error } from "@sveltejs/kit";

export const load = async ({ fetch, route }) => {
  const res = await api(fetch).data.get();
  const id = route.id.replaceAll(/.+\//g, "");
  if (res.ok) {
    return {
      index: res.data,
      name: res.data.find((x) => x.key === id)?.name,
    };
  }
  console.error(res.error);
  error(500, res.error.message);
};

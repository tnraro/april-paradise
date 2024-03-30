import { sbs } from "$routes/stylebook/setup";
import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
  const sb = sbs.get(params.id);
  if (sb == null) error(404);
  const { meta } = await sb.mod();
  const props = meta.variants[params.variant];
  if (props == null) error(404);
  return {
    id: params.id,
    path: sb.path,
    variant: params.variant,
    props,
  };
};

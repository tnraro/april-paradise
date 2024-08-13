import type { SvelteComponent } from "svelte";

export interface StylebookMeta<
  C,
  D extends { $$prop_def: unknown },
> {
  Component: C;
  variants: { default: D["$$prop_def"] } & Record<string, D["$$prop_def"]>;
}
export type StylebookMod = StylebookMeta<
  unknown,
  { $$prop_def: Record<string, unknown> }
>;

export const sb = <
  C,
  D extends { $$prop_def: unknown },
>(options: {
  Component: C;
  variants: { default: D["$$prop_def"] } & Record<string, D["$$prop_def"]>;
}) => options;

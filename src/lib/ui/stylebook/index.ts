import type { ComponentType } from "svelte";

export interface StylebookMeta<
  C extends ComponentType,
  D extends { $$prop_def: unknown },
> {
  Component: C;
  variants: { default: D["$$prop_def"] } & Record<string, D["$$prop_def"]>;
}
export type StylebookMod = StylebookMeta<
  ComponentType,
  { $$prop_def: Record<string, unknown> }
>;

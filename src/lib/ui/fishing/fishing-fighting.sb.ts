import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./fishing-fighting.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      fish: { key: "fish-0" },
      enRatio: 0.4,
      hpRatio: 0.9,
      powerRatio: 0.5,
    },
    edgecase0: {
      fish: { key: "fish-0" },
      enRatio: 2,
      hpRatio: 2,
      powerRatio: 2,
    },
  },
};

import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./fishing-fish-portrait.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      fish: { key: "fish-0" },
    },
    fish1: {
      fish: { key: "fish-1" },
    },
    fish14: {
      fish: { key: "fish-14" },
    },
  },
};

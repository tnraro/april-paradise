import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./inventory-item.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      key: "sample-fish",
      quantity: 53,
    },
  },
};

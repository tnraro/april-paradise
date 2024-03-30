import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./chips.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      quantity: 0,
    },
    one: {
      quantity: 1,
    },
  },
};

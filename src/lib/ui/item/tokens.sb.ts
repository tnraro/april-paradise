import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./tokens.svelte";

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

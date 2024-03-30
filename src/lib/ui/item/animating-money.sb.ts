import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./animating-money.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      type: "chips",
      quantity: 0,
    },
    tokens: {
      type: "tokens",
      quantity: 1,
    },
  },
};

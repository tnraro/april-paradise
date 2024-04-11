import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./order-item.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      key: "ingredient-0",
      quantity: 10,
    },
  },
};

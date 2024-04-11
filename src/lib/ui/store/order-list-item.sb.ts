import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./order-list-item.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      key: "ingredient-0",
      name: "짱긴 문자열 짱긴 문자열",
      quantity: 1,
      price: { type: "chips", quantity: 10 },
      stock: 5,
    },
  },
};

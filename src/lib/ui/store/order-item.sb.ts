import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./order-item.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      key: "ingredient-0",
      name: "럼",
      price: { type: "chips", quantity: 100 },
      quantity: 10,
    },
  },
};

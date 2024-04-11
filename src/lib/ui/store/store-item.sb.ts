import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./store-item.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      key: "ingredient-0",
      name: "럼",
      price: { type: "chips", quantity: 10 },
      stock: 1,
    },
    noneStock: {
      key: "ingredient-0",
      name: "럼",
      price: { type: "chips", quantity: 10 },
    },
    selectedOne: {
      key: "ingredient-0",
      name: "럼",
      price: { type: "chips", quantity: 10 },
      stock: 5,
      quantity: 1,
    },
    selectedAll: {
      key: "ingredient-0",
      name: "럼",
      price: { type: "chips", quantity: 10 },
      stock: 5,
      quantity: 5,
    },
  },
};

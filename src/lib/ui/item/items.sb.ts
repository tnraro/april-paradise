import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./items.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      name: "아이템 이름",
      quantity: 0,
    },
    one: {
      name: "아이템 이름",
      quantity: 1,
    },
    "53": {
      name: "아이템 이름",
      quantity: 53,
    },
  },
};

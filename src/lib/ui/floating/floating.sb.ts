import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./floating.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      type: 0,
    },
    alert: {
      type: 0,
    },
    dialog: {
      type: 1,
    },
    drawer: {
      type: 2,
    },
  },
};

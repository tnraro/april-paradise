import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./bulb.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      on: false,
    },
    on: {
      on: true,
    },
  },
};

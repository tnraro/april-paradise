import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./achievement.sb.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {},
  },
};

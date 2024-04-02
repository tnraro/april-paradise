import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./fishing-approach.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      grade: 0,
    },
    one: {
      grade: 1,
    },
    two: {
      grade: 2,
    },
    three: {
      grade: 3,
    },
    four: {
      grade: 4,
    },
  },
};

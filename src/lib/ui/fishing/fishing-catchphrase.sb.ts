import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./fishing-catchphrase.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      fish: { catchphrase: "잡힌 물고기의 멋진 대사" },
    },
  },
};

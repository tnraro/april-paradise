import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./fishing-current-lures.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      currentLures: {
        "까만 콩 지렁이": 0,
        "토깽이 떡밥": 0,
        "사우루숭 벌레 유충": 0,
      },
    },
  },
};

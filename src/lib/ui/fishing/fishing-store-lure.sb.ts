import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./fishing-store-lure.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      lure: {
        key: "까만 콩 지렁이",
        name: "까만 콩 지렁이",
        price: { type: "chips", quantity: 10 },
      },
    },
    "토깽이 떡밥": {
      lure: {
        key: "토깽이 떡밥",
        name: "토깽이 떡밥",
        price: { type: "chips", quantity: 10 },
      },
    },
    "사우루숭 벌레 유충": {
      lure: {
        key: "사우루숭 벌레 유충",
        name: "사우루숭 벌레 유충",
        price: { type: "chips", quantity: 10 },
      },
    },
  },
};

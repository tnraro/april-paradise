import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./inventory.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      groups: [
        {
          name: "물고기",
          items: [
            {
              key: "sample-fish",
              quantity: 1,
            },
            {
              key: "sample-fish",
              quantity: 2,
            },
          ],
        },
        {
          name: "쓰레기",
          items: [
            {
              key: "sample-fish",
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
};

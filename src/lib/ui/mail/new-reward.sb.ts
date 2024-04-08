import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./new-reward.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      items: [
        { key: "chip", category: "money", name: "칩", description: "" },
        { key: "token", category: "money", name: "토큰", description: "" },
        {
          key: "item-exchange-ticket",
          category: "ticket",
          name: "아이템교환권",
          description: "",
        },
        {
          key: "punishment-ticket",
          category: "ticket",
          name: "벌칙수행권",
          description: "",
        },
      ],
    },
  },
};

import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./mail-list.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      mails: [
        {
          id: "1",
          sender: "총괄",
          title: "연장 점검 안내 및 보상",
          createdAt: new Date(),
          isReceived: false,
        },
        {
          id: "2",
          sender: "총괄",
          title: "긴급 점검 보상 안내",
          createdAt: new Date("2024-04-08"),
          isReceived: true,
        },
        {
          id: "3",
          sender: "총괄",
          title: "임시 점검 안내",
          createdAt: new Date("2024-04-01"),
          isReceived: true,
        },
        {
          id: "4",
          sender: "제니",
          title: "자, 네게만 보내는 편지란다",
          createdAt: new Date("2023-12-04"),
          isReceived: true,
        },
      ],
    },
  },
};

import { sleep } from "$lib/shared/util/sleep";
import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./cocktail-trigger.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      title: "entry",
      triggerType: "탐색",
      onclick: async () => {
        await sleep(1000);
      },
    },
    조사: {
      title: "entry",
      triggerType: "조사",
      onclick: async () => {
        await sleep(1000);
      },
    },
    failed: {
      title: "entry",
      triggerType: "조사",
      onclick: async () => {
        throw 53;
      },
    },
  },
};

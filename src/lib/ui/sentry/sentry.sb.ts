import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./sentry.sb.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      message: "에러입니다",
    },
  },
};

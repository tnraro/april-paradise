import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./animating-text.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      text: "안녕하세요",
    },
    emoji: {
      text: "만나서 반가워요🖐️\n🚀그럼 시작해볼까요?",
    },
    done: {
      text: "짱긴\n문자열\n짱긴\n문자열\n짱긴\n문자열\n짱긴\n문자열",
      done: true,
    },
  },
};

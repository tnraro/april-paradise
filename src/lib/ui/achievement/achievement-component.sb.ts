import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./achievement-component.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      name: "이제 시작",
      condition: "물고기 10마리 낚기",
      reward: { type: "tokens", quantity: 10 },
      isHidden: false,
    },
    hidden: {
      name: "이제 시작",
      condition: "물고기 10마리 낚기",
      reward: { type: "tokens", quantity: 10 },
      isHidden: true,
    },
    done: {
      name: "이제 시작",
      condition: "물고기 10마리 낚기",
      reward: { type: "tokens", quantity: 10 },
      isHidden: false,
      isDone: true,
    },
    notDone: {
      name: "이제 시작",
      condition: "물고기 10마리 낚기",
      reward: { type: "tokens", quantity: 10 },
      isHidden: false,
      isDone: false,
    },
    doneHidden: {
      name: "이제 시작",
      condition: "물고기 10마리 낚기",
      reward: { type: "tokens", quantity: 10 },
      isHidden: true,
      isDone: true,
    },
    notDoneHidden: {
      name: "이제 시작",
      condition: "물고기 10마리 낚기",
      reward: { type: "tokens", quantity: 10 },
      isHidden: true,
      isDone: false,
    },
  },
};

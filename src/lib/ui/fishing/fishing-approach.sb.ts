import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./fishing-approach.svelte";
import { FishingState } from "./fishing-state.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      s: FishingState.Waiting,
      grade: 0,
    },
    one: {
      s: FishingState.Waiting,
      grade: 1,
    },
    two: {
      s: FishingState.Waiting,
      grade: 2,
    },
    three: {
      s: FishingState.Waiting,
      grade: 3,
    },
    four: {
      s: FishingState.Waiting,
      grade: 4,
    },
  },
};

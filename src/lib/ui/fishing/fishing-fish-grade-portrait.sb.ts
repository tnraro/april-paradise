import { FishingGrade } from "$lib/data/sheets/model";
import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./fishing-fish-grade-portrait.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      fish: {
        grade: FishingGrade.Common,
      },
    },
    uncommon: {
      fish: {
        grade: FishingGrade.Uncommon,
      },
    },
    heroic: {
      fish: {
        grade: FishingGrade.Heroic,
      },
    },
    legendary: {
      fish: {
        grade: FishingGrade.Legendary,
      },
    },
    mythic: {
      fish: {
        grade: FishingGrade.Mythic,
      },
    },
  },
};

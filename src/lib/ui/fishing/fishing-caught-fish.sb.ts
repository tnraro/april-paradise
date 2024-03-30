import { FishingGrade } from "$lib/data/sheets/model";
import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./fishing-caught-fish.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      fish: { name: "일반 물고기", grade: FishingGrade.Common },
    },
    uncommon: {
      fish: { name: "고급 물고기", grade: FishingGrade.Uncommon },
    },
    heroic: {
      fish: { name: "영웅 물고기", grade: FishingGrade.Heroic },
    },
    legendary: {
      fish: { name: "전설 물고기", grade: FishingGrade.Legendary },
    },
    mythic: {
      fish: { name: "신화 물고기", grade: FishingGrade.Mythic },
    },
  },
};

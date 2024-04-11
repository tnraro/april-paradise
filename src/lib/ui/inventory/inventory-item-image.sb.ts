import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./inventory-item-image.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      key: "sample-fish",
    },
    "fish-0": {
      key: "fish-0",
    },
    "losing-fish-0": {
      key: "losing-fish-0",
    },
    unknown: {
      key: "unknown",
    },
    slihouette: {
      key: "fish-9",
      silhouette: true,
    },
    notPixel: {
      key: "fish-9",
      pixel: false,
    },
    small: {
      key: "fish-9",
      size: 24,
    },
  },
};

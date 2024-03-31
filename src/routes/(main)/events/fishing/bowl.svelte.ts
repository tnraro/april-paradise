import type {
  InventoryGroup,
  InventoryItem,
} from "$lib/ui/inventory/inventory.types";

let bowl = $state<InventoryGroup[]>([]);

export const useBowl = (initial?: InventoryItem[]) => {
  if (initial) {
    bowl = [
      {
        name: "물고기",
        items: initial,
      },
    ];
  }
  return {
    get groups() {
      return bowl;
    },
  };
};

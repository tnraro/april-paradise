import type { InventoryItem } from "$lib/ui/inventory/inventory.types";

let bowl = $state.frozen<Map<string, InventoryItem>>(new Map());
let fishes = $derived([...bowl.values()]);

export const useBowl = (initial?: InventoryItem[]) => {
  if (initial) {
    bowl = new Map(initial.map((fish) => [fish.key, fish]));
  }
  return {
    get fishes() {
      return fishes;
    },
    addFish(key: string) {
      if (key.startsWith("losing-")) return;
      const fish = bowl.get(key);
      const map = new Map(bowl);
      if (fish != null) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        map.get(key)!.quantity++;
      } else {
        map.set(key, {
          key,
          quantity: 1,
        });
      }
      bowl = map;
    },
  };
};

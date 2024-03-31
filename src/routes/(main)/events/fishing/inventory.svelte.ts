export interface Item {
  item: string;
  quantity: number;
}
export type Inventory = Map<string, Item>;

let inventory = $state<Inventory>(new Map());

export const useInventory = (initial?: Item[]) => {
  if (initial) {
    inventory = new Map(initial.map((item) => [item.item, item]));
  }
  return {
    get inventory() {
      return inventory;
    },
    set(key: string, value: Item) {
      inventory.set(key, value);
    },
  };
};

export interface InventoryItem {
  key: string;
  quantity: number;
}
export interface InventoryGroup {
  name: string;
  items: InventoryItem[];
}

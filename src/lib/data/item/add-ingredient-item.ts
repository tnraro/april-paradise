import type { Client } from "../client";
import { addItem } from "./add-item";

export const addIngredientItem = async (
  client: Client,
  owner: string,
  key: string,
  quantity: number,
) => {
  return await addItem(client, "ingredient", owner, key, quantity);
};

import type { Client } from "../client";
import { addItem } from "./add-item";

export const addFishItem = async (
  client: Client,
  owner: string,
  key: string,
  quantity: number,
) => {
  return await addItem(client, "fish", owner, key, quantity);
};

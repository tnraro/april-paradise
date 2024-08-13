import type { Client } from "../client";
import { addItem } from "./add-item";

export const addLureItem = async (
  client: Client,
  owner: string,
  key: string,
  quantity: number,
) => {
  return await addItem(client, "lure", owner, key, quantity);
};

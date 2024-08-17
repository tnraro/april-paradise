import type { Client } from "../client";
import { addItem } from "./add-item";

export const addGarbageItem = async (
  client: Client,
  owner: string,
  key: string,
  quantity: number,
) => {
  return await addItem(client, "garbage", owner, key, quantity);
};

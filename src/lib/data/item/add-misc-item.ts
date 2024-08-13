import type { Client } from "../client";
import { addItem } from "./add-item";

export const addMiscItem = async (
  client: Client,
  owner: string,
  key: string,
  quantity: number,
) => {
  return await addItem(client, "misc", owner, key, quantity);
};

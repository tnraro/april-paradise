import type { Client } from "../client";
import { addItem } from "./add-item";

export const addTicketItem = async (
  client: Client,
  owner: string,
  key: string,
  quantity: number,
) => {
  return await addItem(client, "ticket", owner, key, quantity);
};

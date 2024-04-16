import type { Executor } from "edgedb";
import { addItem } from "./add-item.query";

interface Args {
  key: string;
  quantity?: number;
}
export const addGarbageItem = async (
  client: Executor,
  { key, quantity = 1 }: Args,
) => {
  return await addItem(client, {
    key,
    category: "garbage",
    quantity,
  });
};

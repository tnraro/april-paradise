export interface ItemProbability {
  item: string;
  probability: number;
}
export const pick = (items: ItemProbability[]) => {
  const p = Math.random();
  let acc = 0;
  for (const item of items) {
    acc += item.probability;
    if (acc > p) {
      return item;
    }
  }
  throw new Error("should not reach here");
}

export const randomRange = (min: number, max: number) => {
  return Math.random() * (max + 1 - min) + min;
}
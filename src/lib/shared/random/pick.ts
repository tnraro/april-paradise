export interface ItemProbability {
  probability: number;
}
export const pick = <T extends ItemProbability>(items: T[]): T => {
  const p = Math.random();
  let acc = 0;
  for (const item of items) {
    acc += item.probability;
    if (acc > p) {
      return item;
    }
  }
  console.warn("warn", p, acc);
  return items[items.length - 1];
};

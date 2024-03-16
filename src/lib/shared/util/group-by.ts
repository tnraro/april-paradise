export const groupBy = <T, R extends string>(items: T[], fn: (x: T) => R) => {
  return items.reduce((group, item) => {
    const key = fn(item);
    const items = group.get(key) ?? [];
    group.set(key, items);
    items.push(item);
    return group;
  }, new Map<R, T[]>());
};

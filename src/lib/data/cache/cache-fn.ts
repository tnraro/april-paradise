export const cacheNullaryFn = <R>(ttl: number, fn: () => R): (() => R) => {
  let lastCalledTime = 0;
  let cachedValue: R;
  return (): R => {
    const now = Date.now();
    if (now < lastCalledTime + ttl * 1000) return cachedValue;
    lastCalledTime = now;
    cachedValue = fn();
    return cachedValue;
  };
};

export const cacheFn = <P extends Array<unknown>, R>(
  ttl: number,
  fn: (...p: P) => R,
): ((...p: P) => R) => {
  const cacheMap = new Map<string, () => R>();
  return (...p: P): R => {
    const key = JSON.stringify(p);
    const cache = cacheMap.get(key) ?? cacheNullaryFn(ttl, () => fn(...p));
    cacheMap.set(key, cache);
    return cache();
  };
};

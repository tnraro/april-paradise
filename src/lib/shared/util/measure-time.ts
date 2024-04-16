export const measureTime = async <R>(
  label: string,
  fn: () => Promise<R> | R,
) => {
  const t = performance.now();
  try {
    const res = await fn();
    console.info(label, "takes", performance.now() - t);
    return res;
  } catch (error) {
    console.error(label, "takes", performance.now() - t);
    throw error;
  }
};

export const measureFnTime = async <P extends unknown[], R>(
  fn: (...p: P) => Promise<R> | R,
  ...args: P
) => {
  return await measureTime(fn.name, () => fn(...args));
};

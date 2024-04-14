export const measureTime = (label: string) => {
  const t = performance.now();
  return () => {
    console.info(label, "takes", performance.now() - t);
  };
};

export const sleep = (delay: number) =>
  new Promise((r) => setTimeout(r, Math.max(0, delay)));

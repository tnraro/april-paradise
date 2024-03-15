export const roulette = (table: { result: string; p: number }[]) => {
  const p = Math.random() * 100;
  let sum = 0;
  for (const row of table) {
    sum += row.p;
    if (p < sum) {
      return {
        result: row.result,
        p,
      };
    }
  }
  return {
    result: "꽝",
    p,
  };
};

export const range = (a: number, b: number) => {
  const p = Math.random();
  return (p * (b - a + 1) + a) | 0;
};

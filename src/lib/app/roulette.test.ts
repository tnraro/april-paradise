import { roulette } from "./roulette";

const table = [
  { result: "칩 10", p: 30 },
  { result: "칩 50", p: 20 },
  { result: "칩 100", p: 5 },
  { result: "칩 2", p: 1.5 },
  { result: "칩 500", p: 1 },
  { result: "아이템교환권", p: 1 },
  { result: "벌칙수행권", p: 1 },
  { result: "칩 1000", p: 0.5 },
];

const m = new Map<string, number>();
const it = 3;
for (let i = 0; i < it; i++) {
  const { result, p } = roulette(table);
  m.set(result, (m.get(result) ?? 0) + 1);
}

console.log(it, "번 돌림");

console.table(
  [...m.entries()]
    .toSorted((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      종류: key,
      횟수: value,
      확률: ((100 * value) / it).toFixed(2) + "%",
    })),
);

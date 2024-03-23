import { sleep } from "./sleep";

export async function* repeat(n: number, delay: number) {
  const _n = Math.max(0, n);
  for (let i = 0; i < _n; i++) {
    yield i;
    if (i < _n - 1) {
      await sleep(delay);
    }
  }
}

import { parseLog } from "./parse-log";

const [_, __, path] = Bun.argv;

const logs = parseLog(await Bun.file(path).text());

const group = [...Map.groupBy(logs, (x) => `${x.method} ${x.path}`)].map(
  ([key, v]) => {
    const times = v.map((x) => x.time);
    const sum = times.reduce((a, b) => a + b, 0);
    const count = times.length;

    return {
      key,
      count,
      avg: sum / count,
      max: Math.max(...times),
      min: Math.min(...times),
    };
  },
);
console.log(group);

Bun.write(`${path}.json`, JSON.stringify(group, undefined, 2));

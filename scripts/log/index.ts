const [_, __, path] = Bun.argv;

const log = [
  ...(await Bun.file(path).text())
    .replaceAll(/(?<=\/api\/mail\/)[^/]+?(?= takes)/g, "[..]")
    .matchAll(
      /(?<method>[A-Z]+) .+(?=\/api\/)\/api(?<path>.+?) takes (?<time>\d+(?:\.\d+)?)/g,
    ),
].map((x) => {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const y = x.groups!;

  return {
    method: y.method,
    path: y.path,
    time: Number(y.time),
  };
});

const group = [...Map.groupBy(log, (x) => `${x.method} ${x.path}`)].map(
  ([key, v]) => {
    const times = v.map((x) => x.time);
    const sum = times.reduce((a, b) => a + b, 0);

    return {
      key,
      sum,
      avg: sum / times.length,
      max: Math.max(...times),
      min: Math.min(...times),
    };
  },
);
console.log(group);

Bun.write(`${path}.json`, JSON.stringify(group, undefined, 2));

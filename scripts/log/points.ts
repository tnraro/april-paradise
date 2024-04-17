import { parseLog } from "./parse-log";

const [_, __, path] = Bun.argv;

const logs = parseLog(await Bun.file(path).text());

const csv = logs
  .map((log) => `${log.method} ${log.path},${log.time}`)
  .join("\n");

console.log(csv);

await Bun.write(`${path}.csv`, csv);

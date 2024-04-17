const dynamicRoutes = /(?<=\/api\/mail\/)[^/]+?(?= takes)/g;
const apiRoute =
  /(?<method>[A-Z]+) .+(?=\/api\/)\/api(?<path>.+?) takes (?<time>\d+(?:\.\d+)?)/g;

export const parseLog = (log: string) => {
  return [...log.replaceAll(dynamicRoutes, "[..]").matchAll(apiRoute)].map(
    (x) => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const y = x.groups!;

      return {
        method: y.method,
        path: y.path,
        time: Number(y.time),
      };
    },
  );
};

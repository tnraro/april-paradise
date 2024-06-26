// biome-ignore lint/suspicious/noExplicitAny: ok
export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a && b && typeof a === "object" && typeof b === "object") {
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      return a.every((e, i) => deepEqual(e, b[i]));
    }
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    if (keys.some((e) => !Object.prototype.hasOwnProperty.call(b, e)))
      return false;
    return keys.every((key) => deepEqual(a[key], b[key]));
  }

  // biome-ignore lint/suspicious/noSelfCompare: to check NaN
  return a !== a && b !== b;
};

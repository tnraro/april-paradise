export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a && b && typeof a === "object" && typeof b === "object") {
    if (a.constructor.name !== b.constructor.name) return false;

    if (Array.isArray(a)) {
      if (a.length != b.length) return false;
      return a.every((e, i) => deepEqual(e, b[i]));
    }
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    if (keys.some((e) => !Object.prototype.hasOwnProperty.call(b, e))) return false;
    return keys.every((key) => deepEqual(a[key], b[key]));
  }

  return a !== a && b !== b;
};

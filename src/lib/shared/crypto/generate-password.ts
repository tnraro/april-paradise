const table = "!0123456789@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
/**
 * generate password using crypto.getRandomValues
 * @param size password length = size * 4
 */
export const generatePassword = (length: number = 32) => {
  if (length <= 0) {
    throw new RangeError("password length must be greater than 0");
  }
  const size = Math.ceil(length / 4);
  return crypto
    .getRandomValues(new Uint8Array(3 * size))
    .reduce(
      (a, b) => {
        const l = a.at(-1)!;
        l.length >= 3 ? a.push([b]) : l.push(b);
        return a;
      },
      [[]] as number[][],
    )
    .map((x) => (x[0] << 16) | (x[1] << 8) | x[2])
    .flatMap((x) => [x, x >> 6, x >> 12, x >> 18].map((x) => table[x & 0x3f]))
    .join("")
    .slice(0, length);
};

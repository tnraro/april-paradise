import { expect, test } from "vitest";
import { generatePassword } from "./generate-password";

test("length", () => {
  for (let i = 1; i <= 100; i++) {
    const password = generatePassword(i);
    expect(password.length).toBe(i);
  }
});

test("negative length", () => {
  expect(() => generatePassword(-1)).toThrowError(RangeError);
});

import { z } from "zod";

export const ID = z
  .string()
  .trim()
  .regex(/^[a-z][a-z0-9_ ]+$/i, {
    message: "id pattern mismatch",
  })
  .min(2, {
    message: "id must be between 2 and 53 characters long",
  })
  .max(53, {
    message: "id must be between 2 and 53 characters long",
  });
export const PASSWORD = z
  .string()
  .trim()
  .min(8, { message: "password must be 8 characters or more" });

import { z } from "zod";

export const TWITTER_ID = z
  .string()
  .trim()
  .min(4, { message: "twitter id must be between 4 and 15 characters long" })
  .max(15, { message: "twitter id must be between 4 and 15 characters long" })
  .regex(/^[\w_]+$/, { message: "twitter id pattern mismatch" });

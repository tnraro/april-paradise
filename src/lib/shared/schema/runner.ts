import { t } from "elysia";
import { z } from "zod";

export const TWITTER_IDz = z
  .string()
  .trim()
  .min(4, { message: "twitter id must be between 4 and 15 characters long" })
  .max(15, { message: "twitter id must be between 4 and 15 characters long" })
  .regex(/^[\w_]+$/, { message: "twitter id pattern mismatch" });
export const TWITTER_ID = t.String({
  title: "Twitter ID",
  minLength: 4,
  maxLength: 15,
  pattern: "^[\\w_]+$",
  default: "twitter_id",
  error: "트위터 아이디를 입력해주세요",
});

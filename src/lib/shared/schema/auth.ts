import { t } from "elysia";
import { z } from "zod";

export const IDz = z
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
export const ID = t.String({
  title: "id",
  minLength: 2,
  maxLength: 53,
  pattern: "^[a-zA-Z][a-zA-Z0-9_ ]+$",
  default: "id",
  error: "아이디는 2자 이상, 53자 이하의 영문자, 숫자, _로 구성해야 합니다",
});
export const PASSWORDz = z
  .string()
  .trim()
  .min(8, { message: "password must be 8 characters or more" });
export const PASSWORD = t.String({
  title: "id",
  minLength: 8,
  error: "비밀번호는 8자 이상이어야 합니다",
});
export const NAMEz = z.string().trim();
export const NAME = t.String({
  title: "name",
  minLength: 1,
  error: "이름은 한 글자 이상이어야 합니다",
});

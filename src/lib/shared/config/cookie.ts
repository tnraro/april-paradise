interface CookieOptions {
  path: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict";
}
export const commonCookieOptions: CookieOptions = {
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

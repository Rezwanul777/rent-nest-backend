// export const accessCookieOptions: CookieOptions = {
//   httpOnly: true,
//   sameSite: "lax",
//   secure: env.nodeEnv !== "development",
//   maxAge: env.jwtAccessExpiresMs,
// };

// export const refreshCookieOptions: CookieOptions = {
//   httpOnly: true,
//   sameSite: "lax",
//   secure: env.nodeEnv !== "development",
//   maxAge: env.jwtRefreshExpiresMs,
//

import type { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

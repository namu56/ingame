import { CookieOptions } from 'express';

export const getCookieOptions = (
  isProduction = process.env.NODE_ENV === 'production'
): CookieOptions => ({
  httpOnly: true,
  sameSite: isProduction ? 'none' : 'lax',
  secure: isProduction,
});

export const getRefreshTokenCookieOptions = (
  isProduction = process.env.NODE_ENV === 'production',
  maxAge = 1000 * 60 * 60 * 24 * 7
): CookieOptions => ({
  ...getCookieOptions(isProduction),
  maxAge,
});

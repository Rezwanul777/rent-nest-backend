import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { UserRole } from "../generated/prisma/enums";

export type TokenPayload = JwtPayload & {
  userId: string;
  role: UserRole;
};

export const createAccessToken = (payload: { userId: string; role: UserRole }) =>
  jwt.sign(payload, config.jwt_access_secret, {
    expiresIn: config.jwtAccessExpiresIn,
  });

export const createRefreshToken = (payload: { userId: string; role: UserRole }) =>
  jwt.sign(payload, config.jwt_refresh_secret, {
    expiresIn: config.jwtRefreshExpiresIn
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, config.jwt_access_secret) as TokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, config.jwt_refresh_secret) as TokenPayload;

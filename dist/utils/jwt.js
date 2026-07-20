import jwt from "jsonwebtoken";
import config from "../config";
export const createAccessToken = (payload) => jwt.sign(payload, config.jwt_access_secret, {
    expiresIn: config.jwtAccessExpiresIn,
});
export const createRefreshToken = (payload) => jwt.sign(payload, config.jwt_refresh_secret, {
    expiresIn: config.jwtRefreshExpiresIn
});
export const verifyAccessToken = (token) => jwt.verify(token, config.jwt_access_secret);
export const verifyRefreshToken = (token) => jwt.verify(token, config.jwt_refresh_secret);
//# sourceMappingURL=jwt.js.map
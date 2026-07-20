import httpStatus from "http-status";
import { prisma } from "../lib/prisma";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { verifyAccessToken } from "../utils/jwt";
const authenticate = catchAsync(async (req, _res, next) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ")
        ? header.split(" ")[1]
        : req.cookies?.accessToken;
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please login to continue");
    }
    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    if (!user)
        throw new AppError(httpStatus.UNAUTHORIZED, "User no longer exists");
    if (!user.isActive)
        throw new AppError(httpStatus.FORBIDDEN, "Your account is inactive");
    req.user = user;
    next();
});
export default authenticate;
//# sourceMappingURL=authentication.js.map
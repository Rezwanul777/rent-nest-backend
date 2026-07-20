import httpStatus from "http-status";
import AppError from "../utils/AppError";
const authorize = (...roles) => (req, _res, next) => {
    if (!req.user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please login to continue");
    }
    if (!roles.includes(req.user.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to perform this action");
    }
    next();
};
export default authorize;
//# sourceMappingURL=authorization.js.map
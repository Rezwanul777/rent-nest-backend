import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { UserRole } from "../generated/prisma/enums";
import AppError from "../utils/AppError";

const authorize = (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Please login to continue");
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not allowed to perform this action",
      );
    }

    next();
  };

export default authorize;

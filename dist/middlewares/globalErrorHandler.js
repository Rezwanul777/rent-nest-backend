import httpStatus from "http-status";
import { ZodError } from "zod";
import config from "../config";
import AppError from "../utils/AppError";
import sendResponse from "../utils/sendResponse";
const globalErrorHandler = (error, _req, res, _next) => {
    const errorStack = config.nodeEnv === "development" ? error?.stack : undefined;
    if (error instanceof AppError) {
        return sendResponse(res, {
            statusCode: error.statusCode,
            success: false,
            message: error.message,
            errorDetails: error.errorDetails,
            errorStack,
        });
    }
    if (error instanceof ZodError) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Validation error",
            errorDetails: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
            errorStack,
        });
    }
    if (error?.code === "P2002") {
        return sendResponse(res, {
            statusCode: httpStatus.CONFLICT,
            success: false,
            message: "A record with the same unique value already exists",
            errorStack,
        });
    }
    if (error?.code === "P2025") {
        return sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: "Requested record was not found",
            errorStack,
        });
    }
    return sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: config.nodeEnv === "development"
            ? error?.message || "Something went wrong"
            : "Something went wrong",
        errorStack,
    });
};
export default globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map
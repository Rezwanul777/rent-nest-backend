import status from "http-status";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";
const register = catchAsync(async (req, res) => {
    const registeredUserData = await authService.register(req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "User created successfully",
        data: registeredUserData,
    });
});
const loginUser = catchAsync(async (req, res) => {
    const result = await authService.login(req.body);
    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: "strict",
    });
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: "strict",
    });
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User logged in successfully!",
        data: { user: result.user, accessToken: result.accessToken },
    });
});
const refreshToken = catchAsync(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        throw new AppError(401, "Refresh token is missing!");
    }
    const result = await authService.refreshAccessToken(token);
    res.cookie("accessToken", result, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Token refreshed successfully",
        data: {
            refreshed: true,
        },
    });
});
const getMe = catchAsync(async (req, res) => {
    const result = await authService.getMe(req.user.id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User data retrieved successfully",
        data: req.user,
    });
});
const logout = catchAsync(async (_req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: "strict",
    });
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Logged out successfully",
    });
});
export const authController = {
    register,
    loginUser,
    refreshToken,
    getMe,
    logout
};
//# sourceMappingURL=auth.controller.js.map
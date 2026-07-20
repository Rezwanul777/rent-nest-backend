import { status } from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminService } from "./admin.service";
const getAllUsers = catchAsync(async (req, res) => {
    const { meta, users } = await adminService.getAllUsers(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Users retrieved successfully",
        data: { meta, users },
    });
});
const updateUserStatus = catchAsync(async (req, res) => {
    const user = await adminService.updateUserStatus(req.params.userId, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: `User ${user.isActive ? "unbanned" : "banned"} successfully`,
        data: user,
    });
});
export const adminController = {
    getAllUsers,
    updateUserStatus,
};
//# sourceMappingURL=admin.controller.js.map
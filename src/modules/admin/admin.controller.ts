import { status } from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { propertyService } from "../property/property.service";
import { GetPropertiesQuery } from "../property/property.interface";
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

const getAllProperties = catchAsync(async (req, res) => {
  const { meta, listings } = await propertyService.listProperties(
    req.query as GetPropertiesQuery,
    {
      type: "ADMIN",
    },
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Properties retrieved successfully",
    data: {
      listings,
      meta,
    },
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const adminId = req.user!.id;
  const userId = req.params.userId as string;

  const user = await adminService.updateUserStatus(
    adminId,
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: `User ${user.isActive ? "unbanned" : "banned"} successfully`,
    data: user,
  });
});

export const adminController = {
  getAllUsers,
  getAllProperties,
  updateUserStatus,
};

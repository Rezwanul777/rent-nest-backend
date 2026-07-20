import status from "http-status";
import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { isValidEnumValue } from "../../utils/validateEnum";
const getAllUsers = async (query) => {
    const limit = Math.max(1, Number(query.limit) || 10);
    const page = Math.max(1, Number(query.page) || 1);
    const skip = (page - 1) * limit;
    const SORTABLE_FIELDS = ["createdAt", "updatedAt"];
    const sortBy = query.sortBy && SORTABLE_FIELDS.includes(query.sortBy)
        ? query.sortBy
        : "createdAt";
    const SORT_ORDERS = ["asc", "desc"];
    const sortOrder = query.sortOrder && SORT_ORDERS.includes(query.sortOrder)
        ? query.sortOrder
        : "desc";
    const andCondition = [];
    const { isActive, role } = query;
    if (typeof isActive !== "undefined") {
        if (!["true", "false"].includes(isActive)) {
            throw new AppError(status.BAD_REQUEST, "isActive must be true or false");
        }
        andCondition.push({ isActive: isActive === "true" ? true : false });
    }
    if (role) {
        if (!isValidEnumValue(UserRole, role)) {
            throw new AppError(status.BAD_REQUEST, "Invalid Role");
        }
        andCondition.push({
            role,
        });
    }
    const users = await prisma.user.findMany({
        where: {
            AND: andCondition,
        },
        omit: {
            password: true,
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
        take: limit,
        skip,
    });
    const totalUsers = await prisma.user.count({
        where: {
            AND: andCondition,
        },
    });
    return {
        meta: {
            page,
            limit,
            total: totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
        },
        users,
    };
};
const updateUserStatus = async (userId, payload) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    if (user.isActive === payload.isActive) {
        throw new AppError(status.CONFLICT, "User is already updated");
    }
    return prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isActive: payload.isActive,
        },
        omit: {
            password: true,
        },
    });
};
export const adminService = {
    getAllUsers,
    updateUserStatus,
};
//# sourceMappingURL=admin.service.js.map
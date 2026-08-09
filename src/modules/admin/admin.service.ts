import status from "http-status";
import { UserRole } from "../../generated/prisma/enums";
import { UserWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { isValidEnumValue } from "../../utils/validateEnum";
import { GetUsersQuery } from "./admin.interface";
import { UpdateUserStatus } from "./admin.validation";


const getAllUsers = async (query: GetUsersQuery) => {
 const requestedLimit = Number(query.limit);
  const requestedPage = Number(query.page);

  const limit =
    Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : 10;

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const skip = (page - 1) * limit;

  const SORTABLE_FIELDS = ["createdAt", "updatedAt"] as const;

  const sortBy =
    query.sortBy && SORTABLE_FIELDS.includes(query.sortBy)
      ? query.sortBy
      : "createdAt";

  const SORT_ORDERS = ["asc", "desc"] as const;

  const sortOrder =
    query.sortOrder && SORT_ORDERS.includes(query.sortOrder)
      ? query.sortOrder
      : "desc";

  const andCondition: UserWhereInput[] = [];

  const { isActive, role, search } = query;
  if (search?.trim()) {
  andCondition.push({
    OR: [
      {
        name: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
    ],
  });
}

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

const updateUserStatus = async ( adminId: string,userId: string, payload: UpdateUserStatus) => {
  if (adminId === userId && payload.isActive === false) {
  throw new AppError(
    status.BAD_REQUEST,
    "You cannot ban your own admin account",
  );
}
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

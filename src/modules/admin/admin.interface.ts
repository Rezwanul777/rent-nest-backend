import { UserRole } from "../../generated/prisma/enums";

export type GetUsersQuery = {
  page?: string;
  limit?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  isActive?: string;
  role?: UserRole;
};
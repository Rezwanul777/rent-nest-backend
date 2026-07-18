import { RentalRequestStatus } from "../../generated/prisma/enums";

export type GetRentalRequestsQuery = {
  page?: string;
  limit?: string;
  sortBy?: "createdAt" | "durationInMonths" | "requestedMoveInDate";
  sortOrder?: "asc" | "desc";
  status?: RentalRequestStatus;
};
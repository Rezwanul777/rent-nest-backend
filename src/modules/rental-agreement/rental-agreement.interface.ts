import { RentalAgreementStatus } from "../../generated/prisma/enums";

export type GetRentalAgreementsQuery = {
  page?: string;
  limit?: string;
  sortBy?:
    | "createdAt"
    | "leaseStartDate"
    | "leaseEndDate"
    | "updatedAt"
    | "activatedAt";
  sortOrder?: "asc" | "desc";
  status?: RentalAgreementStatus;
};
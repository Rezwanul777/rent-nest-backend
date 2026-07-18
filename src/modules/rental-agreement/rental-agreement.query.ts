import status from "http-status";
import { RentalAgreementStatus } from "../../generated/prisma/enums";
import { RentalAgreementWhereInput } from "../../generated/prisma/models";
import AppError from "../../utils/AppError";
import { isValidEnumValue } from "../../utils/validateEnum";
import { GetRentalAgreementsQuery } from "./rental-agreement.interface";

const SORTABLE_FIELDS = [
  "createdAt",
  "leaseStartDate",
  "leaseEndDate",
  "updatedAt",
  "activatedAt",
] as const;

const SORT_ORDERS = ["asc", "desc"] as const;

export const buildRentalAgreementSorting = (
  query: GetRentalAgreementsQuery,
) => {
  const sortBy =
    query.sortBy && SORTABLE_FIELDS.includes(query.sortBy)
      ? query.sortBy
      : "createdAt";

  const sortOrder =
    query.sortOrder && SORT_ORDERS.includes(query.sortOrder)
      ? query.sortOrder
      : "desc";

  return {
    sortBy,
    sortOrder,
  };
};

export type Scope =
  | {
      type: "TENANT";
      tenantId: string;
    }
  | {
      type: "LANDLORD";
      landlordId: string;
    }
  | {
      type: "ADMIN";
    };

export const buildRentalAgreementFilters = (
  query: GetRentalAgreementsQuery,
  scope: Scope,
) => {
  const andCondition: RentalAgreementWhereInput[] = [];

  switch (scope.type) {
    case "LANDLORD":
      andCondition.push({
        property: {
          landlordId: scope.landlordId,
        },
      });
      break;
    case "TENANT":
      andCondition.push({
        tenantId: scope.tenantId,
      });
      break;
  }

  if (query.status) {
    if (!isValidEnumValue(RentalAgreementStatus, query.status)) {
      throw new AppError(status.BAD_REQUEST, "Invalid status query");
    }
    andCondition.push({
      status: query.status,
    } as RentalAgreementWhereInput);
  }

  return andCondition;
};
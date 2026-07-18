import status from "http-status";
import { RentalRequestStatus } from "../../generated/prisma/enums";
import { RentalRequestWhereInput } from "../../generated/prisma/models";
import AppError from "../../utils/AppError";
import { isValidEnumValue } from "../../utils/validateEnum";
import { GetRentalRequestsQuery } from "./rental-request.interface";

const SORTABLE_FIELDS = [
  "createdAt",
  "durationInMonths",
  "requestedMoveInDate",
] as const;

const SORT_ORDERS = ["asc", "desc"] as const;

export const buildRentalRequestSorting = (query: GetRentalRequestsQuery) => {
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

export const buildRentalRequestFilters = (
  query: GetRentalRequestsQuery,
  scope: Scope,
) => {
  const andCondition: RentalRequestWhereInput[] = [];

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
    if (!isValidEnumValue(RentalRequestStatus, query.status)) {
      throw new AppError(status.BAD_REQUEST, "Invalid rental request status");
    }
    andCondition.push({
      status: query.status,
    });
  }

  return andCondition;
};
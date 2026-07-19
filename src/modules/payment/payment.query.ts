import status from "http-status";
import { PaymentProvider, PaymentStatus } from "../../generated/prisma/enums";

import AppError from "../../utils/AppError";
import { isValidEnumValue } from "../../utils/validateEnum";
import { GetPaymentsQuery } from "./payment.interface";
import { PaymentWhereInput } from "../../generated/prisma/models";

const SORTABLE_FIELDS = ["createdAt", "paidAt"] as const;

const SORT_ORDERS = ["asc", "desc"] as const;

export const buildPaymentSorting = (query: GetPaymentsQuery) => {
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

export const buildPaymentFilter = (query: GetPaymentsQuery, scope: Scope) => {
  const andCondition: PaymentWhereInput[] = [];

  switch (scope.type) {
    case "TENANT":
      andCondition.push({
        rentalAgreement: {
          tenantId: scope.tenantId,
        },
      });
      break;

    case "LANDLORD":
      andCondition.push({
        rentalAgreement: {
          property: {
            landlordId: scope.landlordId,
          },
        },
      });
      break;
  }

  if (query.status) {
    if (!isValidEnumValue(PaymentStatus, query.status)) {
      throw new AppError(status.BAD_REQUEST, "Invalid status", [
        {
          field: "status",
          message: `Please choose status from: ${Object.keys(PaymentStatus)}`,
        },
      ]);
    }
    andCondition.push({
      status: query.status,
    });
  }

  if (query.provider) {
    if (!isValidEnumValue(PaymentProvider, query.provider)) {
      throw new AppError(status.BAD_REQUEST, "Invalid provider", [
        {
          field: "status",
          message: `Please choose provider from: ${Object.keys(PaymentProvider)}`,
        },
      ]);
    }
    andCondition.push({
      provider: query.provider,
    });
  }

  return andCondition;
};
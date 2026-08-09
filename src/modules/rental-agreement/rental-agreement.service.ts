import status from "http-status";

import { RentalAgreementStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { GetRentalAgreementsQuery } from "./rental-agreement.interface";
import {
  buildRentalAgreementFilters,
  buildRentalAgreementSorting,
  Scope,
} from "./rental-agreement.query";
import { UpdateRentalAgreementStatus } from "./rental-agreement.validation";
import { getPagination } from "../../utils/pagination";

const listRentalAgreements = async (
  query: GetRentalAgreementsQuery,
  scope: Scope,
) => {
  const page = Number(query.page);
  const limit = Number(query.limit);
  const pagination = getPagination(page, limit);

  const { sortBy, sortOrder } = buildRentalAgreementSorting(query);
  const andCondition = buildRentalAgreementFilters(query, scope);

  const agreements = await prisma.rentalAgreement.findMany({
    where: {
      AND: andCondition,
    },
    select: {
      id: true,
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
        },
      },
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
      status: true,
      activatedAt: true,
      leaseStartDate: true,
      leaseEndDate: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    take: pagination.limit,
    skip: pagination.skip,
  });

  const totalAgreements = await prisma.rentalAgreement.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total: totalAgreements,
      totalPages: Math.ceil(totalAgreements / pagination.limit),
    },
    agreements,
  };
};

const updateRentalAgreementStatus = async (
  tenantId: string,
  rentalAgreementId: string,
  payload: UpdateRentalAgreementStatus,
) => {
  const allowedStatuses = [
    RentalAgreementStatus.COMPLETED,
    RentalAgreementStatus.TERMINATED,
  ];

  if (!allowedStatuses.includes(payload.status)) {
    throw new AppError(status.BAD_REQUEST, "Invalid rental agreement status");
  }

  const rentalAgreement = await prisma.rentalAgreement.findUnique({
    where: {
      id: rentalAgreementId,
    },
    select: {
      id: true,
      tenantId: true,
      status: true,
      leaseEndDate: true,
    },
  });

  if (!rentalAgreement) {
    throw new AppError(status.NOT_FOUND, "Rental agreement not found");
  }

  if (rentalAgreement.tenantId !== tenantId) {
    throw new AppError(
      status.FORBIDDEN,
      "You cannot update another tenant's rental agreement",
    );
  }

  // Treat an identical repeated request as success. This makes the endpoint
  // safe when a browser or network sends the same completion request twice.
  if (rentalAgreement.status === payload.status) {
    return {
      status: rentalAgreement.status,
    };
  }

  if (rentalAgreement.status !== RentalAgreementStatus.ACTIVE) {
    throw new AppError(
      status.CONFLICT,
      `Only an active rental agreement can be marked as ${payload.status.toLowerCase()}`,
    );
  }

  if (
    payload.status === RentalAgreementStatus.COMPLETED &&
    rentalAgreement.leaseEndDate.getTime() > Date.now()
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      "This rental cannot be completed before its lease end date",
    );
  }

  const updateResult = await prisma.rentalAgreement.updateMany({
    where: {
      id: rentalAgreementId,
      tenantId,
      status: RentalAgreementStatus.ACTIVE,
    },
    data: {
      status: payload.status,
    },
  });

  if (updateResult.count === 1) {
    return {
      status: payload.status,
    };
  }

  // Another identical request may have completed the update between the read
  // and updateMany calls. Return success when the desired state already won.
  const latestAgreement = await prisma.rentalAgreement.findUnique({
    where: {
      id: rentalAgreementId,
    },
    select: {
      tenantId: true,
      status: true,
    },
  });

  if (
    latestAgreement?.tenantId === tenantId &&
    latestAgreement.status === payload.status
  ) {
    return {
      status: latestAgreement.status,
    };
  }

  throw new AppError(
    status.CONFLICT,
    "Rental agreement status changed. Refresh and try again.",
  );
};;

export const rentalAgreementService = {
  listRentalAgreements,
  updateRentalAgreementStatus,
};

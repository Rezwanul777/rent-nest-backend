import status from "http-status";
import { PaymentStatus, RentalAgreementStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { GetReviewsQuery } from "./review.interface";
import { CreateReview } from "./review.validate";

const SORT_ORDERS = ["asc", "desc"] as const;

const createReview = async (
  tenantId: string,
  rentalAgreementId: string,
  payload: CreateReview,
) => {
  const rentalAgreement = await prisma.rentalAgreement.findUnique({
    where: {
      id: rentalAgreementId,
    },
    select: {
      tenantId: true,
      propertyId: true,
      status: true,

      review: {
        select: {
          id: true,
        },
      },

      payments: {
        where: {
          status: PaymentStatus.PAID,
        },
        select: {
          id: true,
        },
        take: 1,
      },
    },
  });

  if (!rentalAgreement) {
    throw new AppError(
      status.NOT_FOUND,
      "Rental agreement not found",
    );
  }

  if (rentalAgreement.tenantId !== tenantId) {
    throw new AppError(
      status.FORBIDDEN,
      "You cannot review another tenant's rental agreement",
    );
  }

  const isReviewableStatus =
    rentalAgreement.status === RentalAgreementStatus.ACTIVE ||
    rentalAgreement.status === RentalAgreementStatus.COMPLETED;

  if (!isReviewableStatus) {
    throw new AppError(
      status.BAD_REQUEST,
      "Only active or completed rentals can be reviewed",
    );
  }

  if (rentalAgreement.payments.length === 0) {
    throw new AppError(
      status.BAD_REQUEST,
      "A successful payment is required before leaving a review",
    );
  }

  if (rentalAgreement.review) {
    throw new AppError(
      status.CONFLICT,
      "Review already submitted for this agreement",
    );
  }

  return prisma.review.create({
    data: {
      ...payload,
      tenantId,
      rentalAgreementId,
      propertyId: rentalAgreement.propertyId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,

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
    },
  });
};

const getReviewsByPropertyId = async (
  landlordId: string,
  propertyId: string,
  query: GetReviewsQuery,
) => {
  const limit = Math.max(1, Number(query.limit) || 10);
  const page = Math.max(1, Number(query.page) || 1);
  const skip = (page - 1) * limit;

  const SORTABLE_FIELDS = ["createdAt"] as const;

  const sortBy =
    query.sortBy && SORTABLE_FIELDS.includes(query.sortBy)
      ? query.sortBy
      : "createdAt";

  const sortOrder =
    query.sortOrder && SORT_ORDERS.includes(query.sortOrder)
      ? query.sortOrder
      : "desc";

  const reviews = await prisma.review.findMany({
    where: {
      propertyId,
      property: {
        landlordId,
      },
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
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
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    take: limit,
    skip,
  });

  const totalReviews = await prisma.review.count({
    where: {
      propertyId,
      property: {
        landlordId,
      },
    },
  });

  return {
    meta: {
      page,
      limit,
      total: totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
    },
    reviews,
  };
};

export const reviewService = {
  createReview,
  getReviewsByPropertyId,
};

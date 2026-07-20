import status from "http-status";
import { RentalAgreementStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
const SORT_ORDERS = ["asc", "desc"];
const createReview = async (tenantId, rentalAgreementId, payload) => {
    const validRentalAgreement = await prisma.rentalAgreement.findFirst({
        where: {
            id: rentalAgreementId,
            tenantId: tenantId,
            status: {
                in: [RentalAgreementStatus.COMPLETED, RentalAgreementStatus.TERMINATED],
            },
        },
    });
    if (!validRentalAgreement) {
        throw new AppError(status.NOT_FOUND, "No reviewable rental agreement was found");
    }
    const existingReview = await prisma.review.findUnique({
        where: {
            rentalAgreementId,
        },
    });
    if (existingReview) {
        throw new AppError(status.CONFLICT, "Review already submitted for this agreement");
    }
    return prisma.review.create({
        data: {
            ...payload,
            tenantId,
            rentalAgreementId,
            propertyId: validRentalAgreement.propertyId,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            tenant: {
                select: {
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
const getReviewsByPropertyId = async (landlordId, propertyId, query) => {
    const limit = Math.max(1, Number(query.limit) || 10);
    const page = Math.max(1, Number(query.page) || 1);
    const skip = (page - 1) * limit;
    const SORTABLE_FIELDS = ["createdAt"];
    const sortBy = query.sortBy && SORTABLE_FIELDS.includes(query.sortBy)
        ? query.sortBy
        : "createdAt";
    const sortOrder = query.sortOrder && SORT_ORDERS.includes(query.sortOrder)
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
//# sourceMappingURL=review.service.js.map
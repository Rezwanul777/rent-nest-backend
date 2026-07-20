import status from "http-status";
import { RentalRequestStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { buildRentalRequestFilters, buildRentalRequestSorting, } from "./rental-request.query";
import { getPagination } from "../../utils/pagination";
const submitRentalRequest = async (tenantId, payload) => {
    const { propertyId, tenantMessage, requestedMoveInDate, durationInMonths } = payload;
    const availableProperty = await prisma.property.findFirst({
        where: {
            id: propertyId,
            isAvailable: true,
        },
    });
    if (!availableProperty) {
        throw new AppError(status.NOT_FOUND, "Property is not available");
    }
    const existingRequest = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId,
            status: {
                in: ["PENDING", "APPROVED"],
            },
        },
    });
    if (existingRequest) {
        throw new AppError(status.CONFLICT, "You already have an active rental request for this property");
    }
    return prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId,
            tenantMessage,
            requestedMoveInDate,
            durationInMonths,
        },
        include: {
            property: true,
        },
    });
};
const listRentalRequests = async (query, scope) => {
    const page = Number(query.page);
    const limit = Number(query.limit);
    const pagination = getPagination(page, limit);
    const { sortBy, sortOrder } = buildRentalRequestSorting(query);
    const andCondition = buildRentalRequestFilters(query, scope);
    const requests = await prisma.rentalRequest.findMany({
        where: {
            AND: andCondition,
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            property: {
                select: {
                    id: true,
                    title: true,
                    location: true,
                    rent: true,
                },
            },
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
        take: pagination.limit,
        skip: pagination.skip,
    });
    const totalRequests = await prisma.rentalRequest.count({
        where: {
            AND: andCondition,
        },
    });
    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total: totalRequests,
            totalPages: Math.ceil(totalRequests / pagination.limit),
        },
        requests,
    };
};
const updateRentalRequestStatus = async (landlordId, requestId, payload) => {
    const rentalRequest = await prisma.rentalRequest.findFirst({
        where: {
            id: requestId,
            property: {
                landlordId,
            },
        },
        include: {
            property: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (!rentalRequest) {
        throw new AppError(status.NOT_FOUND, "Rental request not found");
    }
    if (rentalRequest.status !== RentalRequestStatus.PENDING) {
        throw new AppError(status.BAD_REQUEST, "Only pending rental requests can be updated");
    }
    if (payload.status === RentalRequestStatus.REJECTED) {
        const updatedRequest = await prisma.rentalRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: RentalRequestStatus.REJECTED,
            },
            select: {
                status: true,
            },
        });
        return updatedRequest.status;
    }
    const updatedStatus = await prisma.$transaction(async (tx) => {
        const { id: rentalRequestId, tenantId, propertyId, durationInMonths, requestedMoveInDate, status, property, } = await tx.rentalRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: RentalRequestStatus.APPROVED,
            },
            include: {
                property: true,
            },
        });
        const leaseStartDate = new Date(requestedMoveInDate);
        const leaseEndDate = new Date(leaseStartDate);
        leaseEndDate.setMonth(leaseEndDate.getMonth() + durationInMonths);
        leaseEndDate.setDate(leaseEndDate.getDate() - 1);
        await tx.rentalAgreement.create({
            data: {
                rentalRequestId,
                tenantId,
                propertyId,
                monthlyRent: property.rent,
                durationInMonths,
                leaseStartDate,
                leaseEndDate,
            },
        });
        await tx.rentalRequest.updateMany({
            where: {
                propertyId,
                status: RentalRequestStatus.PENDING,
                id: {
                    not: requestId,
                },
            },
            data: {
                status: RentalRequestStatus.REJECTED,
            },
        });
        await tx.property.update({
            where: {
                id: propertyId,
            },
            data: {
                isAvailable: false,
            },
        });
        return status;
    });
    return updatedStatus;
};
export const rentalRequestService = {
    updateRentalRequestStatus,
    submitRentalRequest,
    listRentalRequests,
};
//# sourceMappingURL=rental-request.service.js.map
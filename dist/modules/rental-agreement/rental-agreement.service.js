import status from "http-status";
import { RentalAgreementStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { buildRentalAgreementFilters, buildRentalAgreementSorting, } from "./rental-agreement.query";
import { getPagination } from "../../utils/pagination";
const listRentalAgreements = async (query, scope) => {
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
const updateRentalAgreementStatus = async (tenantId, rentalAgreementId, payload) => {
    const allowedStatuses = [
        RentalAgreementStatus.COMPLETED,
        RentalAgreementStatus.TERMINATED,
    ];
    if (!allowedStatuses.includes(payload.status)) {
        throw new AppError(status.BAD_REQUEST, "Invalid rental agreement status");
    }
    const activeRentalAgreement = await prisma.rentalAgreement.findFirst({
        where: {
            id: rentalAgreementId,
            tenantId,
            status: "ACTIVE",
        },
    });
    if (!activeRentalAgreement) {
        throw new AppError(status.NOT_FOUND, "No agreement found to update");
    }
    return prisma.rentalAgreement.update({
        where: {
            id: rentalAgreementId,
        },
        data: {
            status: payload.status,
        },
        select: {
            status: true,
        },
    });
};
export const rentalAgreementService = {
    listRentalAgreements,
    updateRentalAgreementStatus,
};
//# sourceMappingURL=rental-agreement.service.js.map
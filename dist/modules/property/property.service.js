import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { getPagination } from "../../utils/pagination";
import { buildPropertyFilters, buildPropertySorting } from "./property.query";
import httpStatus from 'http-status';
const createProperty = async (landlordId, payload) => {
    const category = await prisma.category.findUnique({
        where: {
            id: payload.categoryId,
        },
    });
    if (!category) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
    }
    return prisma.property.create({
        data: {
            landlordId,
            ...payload,
        },
    });
};
const getPropertyById = async (propertyId) => {
    const property = await prisma.property.findUnique({
        where: {
            id: propertyId,
            isAvailable: true,
        },
        include: {
            reviews: true,
        },
    });
    if (!property) {
        throw new AppError(httpStatus.NOT_FOUND, "Property not found");
    }
    return property;
};
const getMyPropertyById = async (propertyId, landlordId) => {
    const property = await prisma.property.findFirst({
        where: {
            id: propertyId,
            landlordId,
        },
    });
    if (!property) {
        throw new AppError(httpStatus.NOT_FOUND, "Property not found");
    }
    return property;
};
const updateProperty = async (propertyId, landlordId, payload) => {
    const existingProperty = await prisma.property.findFirst({
        where: {
            id: propertyId,
            landlordId,
        },
    });
    if (!existingProperty) {
        throw new AppError(httpStatus.NOT_FOUND, "Property not found");
    }
    if (payload.categoryId) {
        const category = await prisma.category.findUnique({
            where: {
                id: payload.categoryId,
            },
        });
        if (!category) {
            throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
        }
    }
    return prisma.property.update({
        where: {
            id: propertyId,
            landlordId,
        },
        data: payload,
    });
};
const updatePropertyAvailability = async (propertyId, landlordId) => {
    const property = await prisma.property.findFirst({
        where: {
            id: propertyId,
            landlordId,
        },
    });
    if (!property) {
        throw new AppError(httpStatus.NOT_FOUND, "Property not found");
    }
    const updateAvailabilityStatus = !property.isAvailable;
    return prisma.property.update({
        where: {
            id: propertyId,
            landlordId,
        },
        data: {
            isAvailable: updateAvailabilityStatus,
        },
        select: {
            isAvailable: true,
        },
    });
};
const listProperties = async (query, scope) => {
    const dataLimit = Number(query.limit);
    const currentPage = Number(query.page);
    const { limit, page, skip } = getPagination(currentPage, dataLimit);
    const andCondition = buildPropertyFilters(query, scope);
    const { sortBy, sortOrder } = buildPropertySorting(query);
    const listings = await prisma.property.findMany({
        where: {
            AND: andCondition,
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        omit: {
            categoryId: true,
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
        take: limit,
        skip,
    });
    const propertyCount = await prisma.property.count({
        where: {
            AND: andCondition,
        },
    });
    return {
        meta: {
            page,
            limit,
            total: propertyCount,
            totalPages: Math.ceil(propertyCount / limit),
        },
        listings,
    };
};
export const propertyService = {
    createProperty,
    getMyPropertyById,
    getPropertyById,
    updateProperty,
    updatePropertyAvailability,
    listProperties,
};
//# sourceMappingURL=property.service.js.map
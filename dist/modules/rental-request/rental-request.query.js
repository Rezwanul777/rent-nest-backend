import status from "http-status";
import { RentalRequestStatus } from "../../generated/prisma/enums";
import AppError from "../../utils/AppError";
import { isValidEnumValue } from "../../utils/validateEnum";
const SORTABLE_FIELDS = [
    "createdAt",
    "durationInMonths",
    "requestedMoveInDate",
];
const SORT_ORDERS = ["asc", "desc"];
export const buildRentalRequestSorting = (query) => {
    const sortBy = query.sortBy && SORTABLE_FIELDS.includes(query.sortBy)
        ? query.sortBy
        : "createdAt";
    const sortOrder = query.sortOrder && SORT_ORDERS.includes(query.sortOrder)
        ? query.sortOrder
        : "desc";
    return {
        sortBy,
        sortOrder,
    };
};
export const buildRentalRequestFilters = (query, scope) => {
    const andCondition = [];
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
//# sourceMappingURL=rental-request.query.js.map
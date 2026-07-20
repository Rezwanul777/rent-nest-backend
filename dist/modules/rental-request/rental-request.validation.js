import { z } from "zod";
import { RentalRequestStatus } from "../../generated/prisma/enums";
export const submitRentalRequestSchema = z.object({
    propertyId: z.uuid({
        error: (issue) => issue.input == null ? "Property ID is required" : "Invalid property ID",
    }),
    tenantMessage: z
        .string()
        .trim()
        .min(3, "Message must be at least 3 characters")
        .optional(),
    requestedMoveInDate: z.coerce.date({
        error: (issue) => issue.input == null ? "Date is requried" : "Invalid date",
    }),
    durationInMonths: z.coerce
        .number({
        error: (issue) => issue.input == null
            ? "Duration in months is required"
            : "Invalid duration",
    })
        .int("Duration must be a whole number")
        .min(1, "Duration must be minimum 1 months")
        .max(36, "Duration cannot exceed 36 months"),
});
export const updateRentalRequestStatusSchema = z.object({
    status: z.enum([RentalRequestStatus.APPROVED, RentalRequestStatus.REJECTED], {
        error: (issue) => issue.input == null
            ? "Status is required"
            : "Invalid status! Status can either be APPROVED or REJECTED",
    }),
});
//# sourceMappingURL=rental-request.validation.js.map
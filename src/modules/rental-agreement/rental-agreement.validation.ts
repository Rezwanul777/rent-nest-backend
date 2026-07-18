import z from "zod";
import { RentalAgreementStatus } from "../../generated/prisma/enums";

export const updateRentalAgreementStatusSchema = z.object({
  status: z.enum(
    [RentalAgreementStatus.TERMINATED, RentalAgreementStatus.COMPLETED],
    {
      error: (issue) =>
        issue.input == null
          ? "Status is required"
          : "Invalid status! Status can either be TERMINATED or COMPLETED",
    },
  ),
});

export type UpdateRentalAgreementStatus = z.infer<
  typeof updateRentalAgreementStatusSchema
>;
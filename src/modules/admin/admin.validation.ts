import z from "zod";

export const updateUserStatusSchema = z.object({
  isActive: z.boolean({
    error: (issue) =>
      issue.input == null
        ? "Active status is required"
        : "Status can only be true or false",
  }),
});

export const adminPropertyAvailabilitySchema = z.object({
  isAvailable: z.boolean({
    error: (issue) =>
      issue.input == null
        ? "Property availability is required"
        : "Property availability must be true or false",
  }),
});

export type UpdateUserStatus = z.infer<typeof updateUserStatusSchema>;

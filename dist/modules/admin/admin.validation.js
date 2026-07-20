import z from "zod";
export const updateUserStatusSchema = z.object({
    isActive: z.boolean({
        error: (issue) => issue.input == null
            ? "Active status is required"
            : "Status can only be true or false",
    }),
});
//# sourceMappingURL=admin.validation.js.map
import z from "zod";
export const createCategorySchema = z.object({
    name: z
        .string({
        error: (issue) => issue.input == null
            ? "Category name is required"
            : "Category name must be a string",
    })
        .trim()
        .min(1, "Category name cannot be empty")
        .max(150, "Category name cannot exceed 150 characters"),
});
//# sourceMappingURL=category.validate.js.map
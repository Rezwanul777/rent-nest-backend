import { z } from "zod";
import { UserRole } from "../../generated/prisma/enums";
export const registerSchema = z.object({
    name: z
        .string({
        error: (issue) => issue.input == null ? "Name is required" : "Name must be a string",
    })
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(255, "Name cannot exceed 255 characters"),
    email: z.email({
        error: (issue) => issue.input == null
            ? "Email is required"
            : "Please provide a valid email",
    }),
    password: z
        .string("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(255, "Password cannot exceed 255 characters"),
    role: z.enum([UserRole.TENANT, UserRole.LANDLORD], {
        error: (issue) => issue.input == null
            ? "Role is required"
            : "Invalid role! Role can either be TENANT or LANDLORD",
    }),
});
export const loginSchema = z.object({
    email: z.email({
        error: (issue) => issue.input == null
            ? "Email is required"
            : "Please provide a valid email",
    }),
    password: z
        .string("Password is required")
        .trim()
        .min(1, "Password is required"),
});
export const authValidation = {
    registerSchema,
    loginSchema,
};
//# sourceMappingURL=auth.validation.js.map
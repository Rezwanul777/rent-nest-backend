import z from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number("Rating is required")
    .int("Rating should be a whole number")
    .min(1, "Rating should be at least 1")
    .max(5, "Rating can be maximum 5"),

  comment: z.string().optional(),
});

export type CreateReview = z.infer<typeof createReviewSchema>;
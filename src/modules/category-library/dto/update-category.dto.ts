import { z } from "zod";

export const updateCategorySchema = z.object({
  name: z
    .string("name is required")
    .min(1, "Name must be at least 1 character long")
    .optional(),
});

export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;

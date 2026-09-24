import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string("name is required")
    .min(1, "Name must be at least 1 character long"),
});

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;

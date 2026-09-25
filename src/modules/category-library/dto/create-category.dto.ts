import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string("name is required")
    .min(2, "Name must be at least 2 character long"),
});

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;

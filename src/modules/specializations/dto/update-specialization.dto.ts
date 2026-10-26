import { z } from "zod";

export const updateSpecializationSchema = z.object({
  name: z
    .string("name is required")
    .min(2, "Name must be at least 2 character long")
    .optional(),
});

export type UpdateSpecializationDTO = z.infer<
  typeof updateSpecializationSchema
>;

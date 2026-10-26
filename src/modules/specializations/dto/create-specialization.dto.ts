import { z } from "zod";

export const createSpecializationSchema = z.object({
  name: z
    .string("name is required")
    .min(2, "Name must be at least 2 character long"),
});

export type CreateSpecializationDTO = z.infer<
  typeof createSpecializationSchema
>;

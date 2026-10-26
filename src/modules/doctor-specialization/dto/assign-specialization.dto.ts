import { z } from "zod";

export const assignSpecializationSchema = z.object({
  doctorId: z.string("doctorId is required").cuid("Invalid doctor id"),
  specializationId: z
    .string("specializationId is required")
    .cuid("Invalid specialization id"),
});

export type AssignSpecializationDTO = z.infer<
  typeof assignSpecializationSchema
>;

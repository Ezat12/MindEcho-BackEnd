import { z } from "zod";

export const IdParamSchema = z.object({
  id: z.string().cuid(),
});

export const doctorIdParamSchema = z.object({
  doctorId: z.string().cuid(),
});

export const specializationIdParamSchema = z.object({
  specializationId: z.string().cuid(),
});

export const doctorSpecializationPairParamSchema = z.object({
  doctorId: z.string().cuid(),
  specializationId: z.string().cuid(),
});

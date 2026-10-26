import { z } from "zod";

export const updateDoctorSchema = z.object({
  name: z
    .string("name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be at most 100 characters long")
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters long")
    .nullable()
    .optional(),
  price: z.coerce.number().positive("Price must be positive").optional(),
  sessionDurationMinutes: z.coerce
    .number()
    .int("sessionDurationMinutes must be an integer")
    .positive("sessionDurationMinutes must be positive")
    .optional(),
});

export type UpdateDoctorDTO = z.infer<typeof updateDoctorSchema>;

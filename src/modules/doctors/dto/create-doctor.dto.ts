import { z } from "zod";

export const createDoctorSchema = z.object({
  userId: z.string("userId is required").cuid("Invalid user id"),
  // name: z
  //   .string("name is required")
  //   .min(2, "Name must be at least 2 characters long")
  //   .max(100, "Name must be at most 100 characters long"),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters long")
    .nullable()
    .optional(),
  price: z.coerce
    .number("price is required")
    .positive("Price must be positive"),
  sessionDurationMinutes: z.coerce
    .number("sessionDurationMinutes is required")
    .int("sessionDurationMinutes must be an integer")
    .positive("sessionDurationMinutes must be positive"),
});

export type CreateDoctorDTO = z.infer<typeof createDoctorSchema>;

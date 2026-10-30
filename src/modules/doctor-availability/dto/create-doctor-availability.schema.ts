import { z } from "zod";

export const createDoctorAvailabilitySchema = z
  .object({
    doctorId: z.string().min(1, "Doctor ID is required"),

    dayOfWeek: z.coerce
      .number()
      .int("Day of week must be an integer")
      .min(0, "Day of week must be between 0 and 6")
      .max(6, "Day of week must be between 0 and 6"),

    startTime: z.iso.time({
      precision: 0,
      error: "Start time must be in HH:mm:ss format",
    }),

    endTime: z.iso.time({
      precision: 0,
      error: "End time must be in HH:mm:ss format",
    }),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time",
    path: ["endTime"],
  });

export type CreateDoctorAvailabilityInput = z.infer<
  typeof createDoctorAvailabilitySchema
>;

import { z } from "zod";

export const updateDoctorAvailabilitySchema = z
  .object({
    dayOfWeek: z.coerce
      .number()
      .int("Day of week must be an integer")
      .min(0, "Day of week must be between 0 and 6")
      .max(6, "Day of week must be between 0 and 6")
      .optional(),

    startTime: z.iso
      .time({
        precision: 0,
        error: "Start time must be in HH:mm:ss format",
      })
      .optional(),

    endTime: z.iso
      .time({
        precision: 0,
        error: "End time must be in HH:mm:ss format",
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  })
  .refine(
    (data) => !data.startTime || !data.endTime || data.startTime < data.endTime,
    {
      message: "Start time must be before end time",
      path: ["endTime"],
    },
  );

export type UpdateDoctorAvailabilityInput = z.infer<
  typeof updateDoctorAvailabilitySchema
>;

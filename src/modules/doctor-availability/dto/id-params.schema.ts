import { z } from "zod";

export const doctorAvailabilityIdParamSchema = z.object({
  doctorAvailabilityId: z.string().cuid(),
});

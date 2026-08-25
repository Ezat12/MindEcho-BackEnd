import { z } from "zod";
import { validationPaginationSchema } from "validation/pagination.validation.js";

export const getJournalsQuerySchema = validationPaginationSchema.extend({
  sort: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().trim().optional(),
  moodId: z.string().uuid().optional(),
});

export type GetJournalsQueryDTO = z.infer<typeof getJournalsQuerySchema>;

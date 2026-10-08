import { validationPaginationSchema } from "validation/pagination.validation.js";
import { z } from "zod";

export const paginationLibrarySchema = validationPaginationSchema.extend({
  sort: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().trim().optional(),
  categoryId: z.string().cuid().optional(),
  moodIds: z.array(z.string().cuid()).optional(),
});

export type PaginationLibraryDTO = z.infer<typeof paginationLibrarySchema>;

import { validationPaginationSchema } from "validation/pagination.validation.js";
import { z } from "zod";

export const paginationDoctorSchema = validationPaginationSchema.extend({
  sort: z.enum(["createdAt", "updatedAt", "name", "price"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().trim().optional(),
  specializationId: z.string().cuid().optional(),
});

export type PaginationDoctorDTO = z.infer<typeof paginationDoctorSchema>;

import { z } from "zod";

export const updateLibrarySchema = z.object({
  title: z
    .string("Title must be a string")
    .nonempty("Title cannot be empty")
    .optional(),

  description: z
    .string("Description must be a string")
    .nonempty("Description cannot be empty")
    .optional(),

  content: z.string("Content must be a string").optional(),

  categoryId: z
    .string("Category ID must be a string")
    .nonempty("Category ID cannot be empty")
    .optional(),

  moodIds: z
    .array(z.string())
    .min(1, "At least one mood is required")
    .optional(),
});

export type UpdateLibraryDTO = z.infer<typeof updateLibrarySchema>;

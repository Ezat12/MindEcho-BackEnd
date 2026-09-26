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

  imageUrl: z
    .string("Image URL must be a string")
    .url("Invalid image URL")
    .nonempty("Image URL cannot be empty")
    .optional(),

  content: z.string("Content must be a string").optional(),

  url: z.string("URL must be a string").url("Invalid URL").optional(),

  categoryId: z
    .string("Category ID must be a string")
    .nonempty("Category ID cannot be empty")
    .optional(),
});

export type UpdateLibraryDTO = z.infer<typeof updateLibrarySchema>;

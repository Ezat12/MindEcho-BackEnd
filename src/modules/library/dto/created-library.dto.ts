import { z } from "zod";

export const createLibrarySchema = z.object({
  title: z.string("Title is required").nonempty("Title is required"),

  description: z
    .string("Description is required")
    .nonempty("Description is required"),

  imageUrl: z
    .string("Image URL is required")
    .url("Invalid image URL")
    .nonempty("Image URL is required"),

  content: z.string().optional(),

  url: z.string().url("Invalid URL").optional(),

  categoryId: z
    .string("Category ID is required")
    .nonempty("Category ID is required"),

  moodIds: z
    .array(z.string("Mood ID is required"))
    .min(1, "At least one mood is required")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Mood IDs must be unique",
    }),
});

export type CreateLibraryDTO = z.infer<typeof createLibrarySchema>;

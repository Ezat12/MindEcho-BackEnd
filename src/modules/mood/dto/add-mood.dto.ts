import { z } from "zod";

const addMoodSchema = z.object({
  name: z
    .string("name is required")
    .min(1, "Name must be at least 1 character long"),
  slug: z
    .string("slug is required")
    .min(1, "Slug must be at least 1 character long"),
  icon: z.string("icon is required").nullable().optional(),
  description: z.string("description is required").nullable().optional(),
});

export type AddMoodDTO = z.infer<typeof addMoodSchema>;

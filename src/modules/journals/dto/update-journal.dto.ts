import { z } from "zod";

export const updateJournalSchema = z.object({
  title: z
    .string("title is required")
    .min(1, "Title must be at least 1 character long")
    .optional(),
  content: z
    .string("content is required")
    .min(1, "Content must be at least 1 character long")
    .optional(),
  moodId: z.string("moodId is required").optional().nullable(),
});

export type UpdateJournalDTO = z.infer<typeof updateJournalSchema>;

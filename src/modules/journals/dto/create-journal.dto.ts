import { z } from "zod";

export const CreateJournalSchema = z.object({
  title: z
    .string("title is required")
    .min(1, "Title must be at least 1 character long"),
  content: z
    .string("content is required")
    .min(1, "Content must be at least 1 character long"),
  attachments: z.array(z.string()).optional(),
  moodId: z.string("moodId is required").optional().nullable(),
});

export type CreateJournalDTO = z.infer<typeof CreateJournalSchema>;

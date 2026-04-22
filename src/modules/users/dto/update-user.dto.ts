import z from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

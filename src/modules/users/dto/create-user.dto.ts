import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string("Email is required")
    .email("Invalid email address")
    .nonempty("Email is required"),
  password : z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long")
    .nonempty("Password is required"),
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be at most 100 characters long")
    .nonempty("Name is required"),
  avatarUrl: z
    .string("Avatar URL is required")
    .url("Invalid avatar URL")
    .nullable()
    .optional(),
  bio: z
    .string("Bio is required")
    .max(500, "Bio must be at most 500 characters long")
    .nullable()
    .optional(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

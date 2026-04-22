import z from "zod";
import { createUserSchema } from "../../users/dto/create-user.dto.js";

export const registerUserSchema = createUserSchema
  .extend({
    confirmPassword: z
      .string("Confirm Password is required")
      .min(6)
      .max(100)
      .nonempty("Confirm Password cannot be empty"),
    role: z
      .enum(["CLIENT", "ADMIN", "DOCTOR"], {
        message: "Role must be one of: CLIENT, ADMIN, DOCTOR",
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;

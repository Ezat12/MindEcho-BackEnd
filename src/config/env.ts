import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3030),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET_KEY: z.string().min(1, "JWT_SECRET_KEY is required"),
  JWT_EXPIRES_IN: z.string().default("2d"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

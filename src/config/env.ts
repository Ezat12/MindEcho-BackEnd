import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3030),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_ACCESS_SECRET_KEY: z.string().min(1, "JWT_ACCESS_SECRET_KEY is required"),
  JWT_REFRESH_SECRET_KEY: z
    .string()
    .min(1, "JWT_REFRESH_SECRET_KEY is required"),
  JWT_EXPIRES_ACCESS_IN: z.string().default("15m"),
  JWT_EXPIRES_REFRESH_IN: z.string().default("7d"),
  REDIS_EX_REFRESH_TOKEN: z.coerce.number().default(7),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

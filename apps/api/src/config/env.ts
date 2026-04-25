import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  PORT: z.string().default("3001"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

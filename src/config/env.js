import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().min(1024).max(65535).default(3000),
  MONGO_URI: z
    .string()
    .min(1, "WT_EXPIRE cannot be empty")
    .regex(/^mongodb(\+srv)?:\/\//, "Invalid MongoDB connection string format"),
  JWT_SECRET_KEY: z
    .string()
    .min(32, "JWT secret key must be at least 32 characters for security"),
  JWT_EXPIRE: z
    .string()
    .min(1, "JWT_EXPIRE cannot be empty")
    .regex(
      /^\d+[smhdy]$/,
      "JWT_EXPIRE must be a valid time format (e.g. '60s', '7d', '24h', '30m')",
    )
    .default("7d"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.log(`[FATAL] [ENV] Invalid or missing environment variables, Shutting down...`);
  console.log(_env.error);
  process.exit(1);
}

const env = Object.freeze(_env.data);

export {env};

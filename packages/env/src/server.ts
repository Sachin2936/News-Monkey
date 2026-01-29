import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    CORS_ORIGIN: z.string()
      .transform((val) => val.split(",").map(v => v.trim()))
      .pipe(z.array(z.string().url())),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

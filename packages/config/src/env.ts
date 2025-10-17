import { z } from "zod"

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Auth
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Database - Supabase
  SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  // Database - Neon
  NEON_DATABASE_URL: z.string().optional(),

  // Database - MongoDB
  MONGODB_URI: z.string().optional(),

  // Database - Heroku Postgres
  HEROKU_POSTGRESQL_URL: z.string().optional(),

  // Database - Prisma
  DATABASE_URL: z.string(),

  // AI Providers
  OPENAI_API_KEY: z.string(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  XAI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  HEROKU_INFERENCE_URL: z.string().url().optional(),
  HEROKU_API_KEY: z.string().optional(),

  // AWS
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default("us-east-1"),
  AWS_S3_BUCKET: z.string().optional(),

  // Integrations
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  // Analytics (Server-side only)
  POSTHOG_API_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

let env: Env | undefined

export function validateEnv(): Env {
  if (env) return env

  try {
    env = envSchema.parse(process.env)
    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:")
      console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
    }
    throw new Error("Invalid environment variables")
  }
}

export function getEnv(): Env {
  if (!env) {
    env = validateEnv()
  }
  return env
}

export function getAnalyticsConfig() {
  const env = getEnv()
  return {
    posthogKey: env.POSTHOG_API_KEY,
    posthogHost: env.POSTHOG_HOST,
  }
}

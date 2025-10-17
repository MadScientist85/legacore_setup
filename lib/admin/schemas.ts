import { z } from "zod"

// User management schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().min(1),
  role: z.enum(["admin", "user", "manager"]),
  status: z.enum(["active", "inactive", "suspended"]),
  created_at: z.string().datetime(),
  last_login: z.string().datetime().nullable(),
})

export const updateUserSchema = z.object({
  full_name: z.string().min(1).optional(),
  role: z.enum(["admin", "user", "manager"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
})

// Database status schemas
export const databaseStatusSchema = z.object({
  name: z.string(),
  type: z.enum(["supabase", "mongodb", "redis", "postgres"]),
  status: z.enum(["connected", "disconnected", "error"]),
  latency: z.number().nullable(),
  last_checked: z.string().datetime(),
  error_message: z.string().nullable(),
})

// AI provider schemas
export const aiProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.enum(["openai", "anthropic", "google", "groq", "xai", "openrouter"]),
  status: z.enum(["active", "inactive", "error"]),
  model: z.string(),
  requests_today: z.number(),
  tokens_used_today: z.number(),
  last_request: z.string().datetime().nullable(),
  error_message: z.string().nullable(),
})

// RFP analytics schemas
export const rfpAnalyticsSchema = z.object({
  total_rfps: z.number(),
  active_rfps: z.number(),
  completed_rfps: z.number(),
  success_rate: z.number(),
  avg_completion_time_hours: z.number(),
  recent_activity: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      status: z.string(),
      created_at: z.string().datetime(),
    })
  ),
})

// System metrics schemas
export const systemMetricsSchema = z.object({
  uptime_seconds: z.number(),
  environment: z.enum(["development", "staging", "production"]),
  version: z.string(),
  commit_sha: z.string().nullable(),
  deployed_at: z.string().datetime().nullable(),
  node_version: z.string(),
  next_version: z.string(),
})

// Export types
export type User = z.infer<typeof userSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
export type DatabaseStatus = z.infer<typeof databaseStatusSchema>
export type AIProvider = z.infer<typeof aiProviderSchema>
export type RFPAnalytics = z.infer<typeof rfpAnalyticsSchema>
export type SystemMetrics = z.infer<typeof systemMetricsSchema>

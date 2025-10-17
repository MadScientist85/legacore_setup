import { z } from "zod"

// Health check schemas
export const healthCheckSchema = z.object({
  service: z.string(),
  status: z.enum(["healthy", "degraded", "unhealthy"]),
  latency_ms: z.number().nullable(),
  last_checked: z.string().datetime(),
  details: z.record(z.any()).optional(),
  error: z.string().nullable(),
})

export const databaseHealthSchema = z.object({
  supabase: healthCheckSchema,
  mongodb: healthCheckSchema,
  redis: healthCheckSchema,
  postgres: healthCheckSchema.optional(),
})

export const applicationHealthSchema = z.object({
  api: healthCheckSchema,
  background_jobs: healthCheckSchema,
  queue: healthCheckSchema,
  websocket: healthCheckSchema.optional(),
})

export const storageHealthSchema = z.object({
  vercel_blob: healthCheckSchema,
  total_storage_mb: z.number(),
  used_storage_mb: z.number(),
  available_storage_mb: z.number(),
})

export const versionInfoSchema = z.object({
  commit_sha: z.string().nullable(),
  branch: z.string().nullable(),
  tag: z.string().nullable(),
  deployed_at: z.string().datetime().nullable(),
  build_id: z.string().nullable(),
})

export const overallHealthSchema = z.object({
  status: z.enum(["healthy", "degraded", "unhealthy"]),
  timestamp: z.string().datetime(),
  database: databaseHealthSchema,
  application: applicationHealthSchema,
  storage: storageHealthSchema,
  version: versionInfoSchema,
})

// Export types
export type HealthCheck = z.infer<typeof healthCheckSchema>
export type DatabaseHealth = z.infer<typeof databaseHealthSchema>
export type ApplicationHealth = z.infer<typeof applicationHealthSchema>
export type StorageHealth = z.infer<typeof storageHealthSchema>
export type VersionInfo = z.infer<typeof versionInfoSchema>
export type OverallHealth = z.infer<typeof overallHealthSchema>

import type { DatabaseHealth, ApplicationHealth, StorageHealth, VersionInfo, OverallHealth } from "./schemas"

// Mock database health data
export const mockDatabaseHealth: DatabaseHealth = {
  supabase: {
    service: "Supabase",
    status: "healthy",
    latency_ms: 45,
    last_checked: new Date().toISOString(),
    details: {
      connection_pool: "active",
      active_connections: 12,
      max_connections: 100,
    },
    error: null,
  },
  mongodb: {
    service: "MongoDB",
    status: "healthy",
    latency_ms: 23,
    last_checked: new Date().toISOString(),
    details: {
      replica_set: "active",
      nodes: 3,
    },
    error: null,
  },
  redis: {
    service: "Redis Cache",
    status: "healthy",
    latency_ms: 12,
    last_checked: new Date().toISOString(),
    details: {
      memory_usage_mb: 245,
      hit_rate: 94.5,
    },
    error: null,
  },
  postgres: {
    service: "Heroku Postgres",
    status: "healthy",
    latency_ms: 67,
    last_checked: new Date().toISOString(),
    details: {
      database_size_mb: 1234,
      connections: 8,
    },
    error: null,
  },
}

// Mock application health data
export const mockApplicationHealth: ApplicationHealth = {
  api: {
    service: "API Endpoints",
    status: "healthy",
    latency_ms: 89,
    last_checked: new Date().toISOString(),
    details: {
      total_endpoints: 45,
      healthy_endpoints: 45,
      avg_response_time_ms: 89,
    },
    error: null,
  },
  background_jobs: {
    service: "Background Jobs",
    status: "healthy",
    latency_ms: null,
    last_checked: new Date().toISOString(),
    details: {
      queue_size: 12,
      processing: 3,
      failed_last_hour: 0,
    },
    error: null,
  },
  queue: {
    service: "Message Queue",
    status: "healthy",
    latency_ms: 15,
    last_checked: new Date().toISOString(),
    details: {
      pending_messages: 8,
      processing_rate_per_min: 150,
    },
    error: null,
  },
  websocket: {
    service: "WebSocket Server",
    status: "healthy",
    latency_ms: 5,
    last_checked: new Date().toISOString(),
    details: {
      active_connections: 45,
      messages_per_second: 23,
    },
    error: null,
  },
}

// Mock storage health data
export const mockStorageHealth: StorageHealth = {
  vercel_blob: {
    service: "Vercel Blob Storage",
    status: "healthy",
    latency_ms: 120,
    last_checked: new Date().toISOString(),
    details: {
      total_files: 2345,
      total_size_gb: 45.6,
    },
    error: null,
  },
  total_storage_mb: 100000, // 100 GB
  used_storage_mb: 46720, // ~45.6 GB
  available_storage_mb: 53280,
}

// Mock version info data
export const mockVersionInfo: VersionInfo = {
  commit_sha: "a1b2c3d4e5f6",
  branch: "main",
  tag: "v1.2.3",
  deployed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  build_id: "build-20250917-123456",
}

// Mock overall health data
export const mockOverallHealth: OverallHealth = {
  status: "healthy",
  timestamp: new Date().toISOString(),
  database: mockDatabaseHealth,
  application: mockApplicationHealth,
  storage: mockStorageHealth,
  version: mockVersionInfo,
}

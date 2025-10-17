import type { User, DatabaseStatus, AIProvider, RFPAnalytics, SystemMetrics } from "./schemas"

// Mock users data
export const mockUsers: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "admin@legacore.com",
    full_name: "Admin User",
    role: "admin",
    status: "active",
    created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "john.doe@example.com",
    full_name: "John Doe",
    role: "user",
    status: "active",
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "jane.smith@example.com",
    full_name: "Jane Smith",
    role: "manager",
    status: "active",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    email: "bob.wilson@example.com",
    full_name: "Bob Wilson",
    role: "user",
    status: "inactive",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    email: "alice.jones@example.com",
    full_name: "Alice Jones",
    role: "user",
    status: "active",
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
]

// Mock database status data
export const mockDatabaseStatus: DatabaseStatus[] = [
  {
    name: "Supabase",
    type: "supabase",
    status: "connected",
    latency: 45,
    last_checked: new Date().toISOString(),
    error_message: null,
  },
  {
    name: "MongoDB",
    type: "mongodb",
    status: "connected",
    latency: 23,
    last_checked: new Date().toISOString(),
    error_message: null,
  },
  {
    name: "Redis Cache",
    type: "redis",
    status: "connected",
    latency: 12,
    last_checked: new Date().toISOString(),
    error_message: null,
  },
  {
    name: "Heroku Postgres",
    type: "postgres",
    status: "connected",
    latency: 67,
    last_checked: new Date().toISOString(),
    error_message: null,
  },
]

// Mock AI provider status data
export const mockAIProviders: AIProvider[] = [
  {
    id: "openai-gpt4",
    name: "OpenAI GPT-4",
    provider: "openai",
    status: "active",
    model: "gpt-4-turbo-preview",
    requests_today: 1247,
    tokens_used_today: 3589234,
    last_request: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    error_message: null,
  },
  {
    id: "anthropic-claude",
    name: "Anthropic Claude",
    provider: "anthropic",
    status: "active",
    model: "claude-3-opus-20240229",
    requests_today: 892,
    tokens_used_today: 2456789,
    last_request: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    error_message: null,
  },
  {
    id: "google-gemini",
    name: "Google Gemini",
    provider: "google",
    status: "active",
    model: "gemini-1.5-pro",
    requests_today: 534,
    tokens_used_today: 1234567,
    last_request: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    error_message: null,
  },
  {
    id: "groq-llama",
    name: "Groq LLama",
    provider: "groq",
    status: "active",
    model: "llama3-70b-8192",
    requests_today: 678,
    tokens_used_today: 1876543,
    last_request: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    error_message: null,
  },
  {
    id: "openrouter-mixed",
    name: "OpenRouter",
    provider: "openrouter",
    status: "active",
    model: "auto",
    requests_today: 345,
    tokens_used_today: 987654,
    last_request: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    error_message: null,
  },
]

// Mock RFP analytics data
export const mockRFPAnalytics: RFPAnalytics = {
  total_rfps: 347,
  active_rfps: 23,
  completed_rfps: 312,
  success_rate: 89.9,
  avg_completion_time_hours: 48.5,
  recent_activity: [
    {
      id: "rfp-001",
      title: "Legal Document Review - Tech Corp",
      status: "completed",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "rfp-002",
      title: "Contract Analysis - Finance Inc",
      status: "active",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "rfp-003",
      title: "Compliance Check - Healthcare Ltd",
      status: "active",
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "rfp-004",
      title: "Trust Management - Estate Planning",
      status: "completed",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "rfp-005",
      title: "Surplus Funds Recovery - County Records",
      status: "active",
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

// Mock system metrics data
export const mockSystemMetrics: SystemMetrics = {
  uptime_seconds: 2592000, // 30 days
  environment: "production",
  version: "1.2.3",
  commit_sha: "a1b2c3d4e5f6",
  deployed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  node_version: process.version || "v20.10.0",
  next_version: "14.2.16",
}

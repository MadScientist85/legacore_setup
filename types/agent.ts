export type AgentType =
  | "surplus-funds"
  | "credit-repair"
  | "debt-buyer"
  | "trust-management"
  | "government-contracting"
  | "contract-review"
  | "legal-research"
  | "compliance-check"

export interface AgentConfig {
  id: string
  name: string
  type: AgentType
  description: string
  instructions: string
  model: string
  isActive: boolean
  category?: string
  functions?: AgentFunction[]
  version?: string
}

export interface AgentFunction {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, any>
    required: string[]
  }
}

export interface AgentRunRequest {
  agentId: string
  input: string
  userId?: string
}

export interface AgentRunResponse {
  runId: string
  output: string
  status: "completed" | "failed" | "pending"
  tokensUsed?: number
  durationMs?: number
  error?: string
}

export interface AgentRunHistory {
  id: string
  agentId: string
  agentName: string
  input: string
  output: string
  status: string
  createdAt: string
  tokensUsed: number | null
  durationMs: number | null
}

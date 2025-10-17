export interface AIModelConfig {
  id: string
  provider: "openai" | "anthropic" | "google" | "groq" | "xai" | "openrouter" | "heroku"
  name: string
  maxTokens: number
  costPer1kTokens: {
    input: number
    output: number
  }
  features: string[]
  recommended: boolean
}

export const aiModels: Record<string, AIModelConfig> = {
  "gpt-4o": {
    id: "gpt-4o",
    provider: "openai",
    name: "GPT-4 Optimized",
    maxTokens: 128000,
    costPer1kTokens: { input: 0.005, output: 0.015 },
    features: ["function-calling", "vision", "json-mode"],
    recommended: true,
  },
  "gpt-4-turbo": {
    id: "gpt-4-turbo-preview",
    provider: "openai",
    name: "GPT-4 Turbo",
    maxTokens: 128000,
    costPer1kTokens: { input: 0.01, output: 0.03 },
    features: ["function-calling", "json-mode"],
    recommended: false,
  },
  "claude-3-opus": {
    id: "claude-3-opus-20240229",
    provider: "anthropic",
    name: "Claude 3 Opus",
    maxTokens: 200000,
    costPer1kTokens: { input: 0.015, output: 0.075 },
    features: ["function-calling", "vision"],
    recommended: true,
  },
  "claude-3-sonnet": {
    id: "claude-3-sonnet-20240229",
    provider: "anthropic",
    name: "Claude 3 Sonnet",
    maxTokens: 200000,
    costPer1kTokens: { input: 0.003, output: 0.015 },
    features: ["function-calling", "vision"],
    recommended: true,
  },
  "gemini-pro": {
    id: "gemini-pro",
    provider: "google",
    name: "Gemini Pro",
    maxTokens: 32000,
    costPer1kTokens: { input: 0.0005, output: 0.0015 },
    features: ["function-calling"],
    recommended: false,
  },
  "llama-3-70b": {
    id: "llama3-70b-8192",
    provider: "groq",
    name: "Llama 3 70B",
    maxTokens: 8192,
    costPer1kTokens: { input: 0.0, output: 0.0 },
    features: ["fast-inference"],
    recommended: true,
  },
  "grok-beta": {
    id: "grok-beta",
    provider: "xai",
    name: "Grok Beta",
    maxTokens: 131072,
    costPer1kTokens: { input: 0.005, output: 0.015 },
    features: ["real-time-data"],
    recommended: false,
  },
}

export function getModelById(id: string): AIModelConfig | undefined {
  return aiModels[id]
}

export function getModelsByProvider(provider: AIModelConfig["provider"]): AIModelConfig[] {
  return Object.values(aiModels).filter((model) => model.provider === provider)
}

export function getRecommendedModels(): AIModelConfig[] {
  return Object.values(aiModels).filter((model) => model.recommended)
}

export interface AIMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface AIResponse {
  content: string
  model: string
  provider: string
  tokensUsed: number
  cost: number
  latencyMs: number
}

export interface StreamOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  onToken?: (token: string) => void
}

export interface AIProvider {
  name: string
  generateText(
    messages: AIMessage[],
    options?: {
      model?: string
      temperature?: number
      maxTokens?: number
    },
  ): Promise<AIResponse>
  streamText(messages: AIMessage[], options?: StreamOptions): AsyncGenerator<string, void, unknown>
}

export type ProviderName = "openai" | "anthropic" | "google" | "groq" | "xai" | "openrouter" | "heroku"

export interface ModelConfig {
  provider: ProviderName
  model: string
  maxTokens?: number
  temperature?: number
}

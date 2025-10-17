import { OpenAIClient } from "./openai"
import { AnthropicClient } from "./anthropic"
import { GoogleClient } from "./google"
import { GroqClient } from "./groq"
import { XAIClient } from "./xai"
import { OpenRouterClient } from "./openrouter"
import { HerokuInferenceClient } from "./heroku-inference"

export type AIProvider = "openai" | "anthropic" | "google" | "groq" | "xai" | "openrouter" | "heroku"

export interface AIMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface CompletionOptions {
  model: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

export interface CompletionResponse {
  output: string
  tokensUsed: number
  durationMs: number
  provider: AIProvider
  model: string
  cost?: number
}

export class ModelManager {
  private clients: Map<AIProvider, any> = new Map()
  private fallbackOrder: AIProvider[] = ["openai", "anthropic", "groq", "google", "xai", "openrouter", "heroku"]

  constructor() {
    // Initialize all clients
    this.clients.set("openai", new OpenAIClient())
    this.clients.set("anthropic", new AnthropicClient())
    this.clients.set("google", new GoogleClient())
    this.clients.set("groq", new GroqClient())
    this.clients.set("xai", new XAIClient())
    this.clients.set("openrouter", new OpenRouterClient())
    this.clients.set("heroku", new HerokuInferenceClient())
  }

  async createCompletion(
    messages: AIMessage[],
    options: CompletionOptions,
    preferredProvider?: AIProvider,
  ): Promise<CompletionResponse> {
    const startTime = Date.now()

    // Try preferred provider first
    if (preferredProvider && this.clients.has(preferredProvider)) {
      try {
        const client = this.clients.get(preferredProvider)
        const result = await client.complete(messages, options)
        return {
          ...result,
          durationMs: Date.now() - startTime,
          provider: preferredProvider,
        }
      } catch (error) {
        console.error(`Provider ${preferredProvider} failed, trying fallback`, error)
      }
    }

    // Try fallback providers
    for (const provider of this.fallbackOrder) {
      try {
        const client = this.clients.get(provider)
        if (!client) continue

        const result = await client.complete(messages, options)
        return {
          ...result,
          durationMs: Date.now() - startTime,
          provider,
        }
      } catch (error) {
        console.error(`Provider ${provider} failed`, error)
        continue
      }
    }

    throw new Error("All AI providers failed")
  }

  async *streamCompletion(
    messages: AIMessage[],
    options: CompletionOptions,
    preferredProvider?: AIProvider,
  ): AsyncGenerator<string, void, unknown> {
    const provider = preferredProvider || this.fallbackOrder[0]
    const client = this.clients.get(provider)

    if (!client) {
      throw new Error(`Provider ${provider} not available`)
    }

    yield* client.stream(messages, options)
  }
}

// Singleton instance
let modelManager: ModelManager | null = null

export function getModelManager(): ModelManager {
  if (!modelManager) {
    modelManager = new ModelManager()
  }
  return modelManager
}

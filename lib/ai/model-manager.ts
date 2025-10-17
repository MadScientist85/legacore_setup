import { generateText as openaiGenerate, streamText as openaiStream } from "./openai-client"
import { generateText as googleGenerate, streamText as googleStream } from "./google-client"

export type AIProvider = "openai" | "google" | "anthropic" | "groq" | "xai" | "openrouter"

export interface ModelConfig {
  provider: AIProvider
  model: string
  fallback?: {
    provider: AIProvider
    model: string
  }
}

export class ModelManager {
  private static instance: ModelManager

  private constructor() {}

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager()
    }
    return ModelManager.instance
  }

  async generateText(prompt: string, config: ModelConfig): Promise<string> {
    try {
      switch (config.provider) {
        case "openai":
          return await openaiGenerate(prompt, config.model)
        case "google":
          return await googleGenerate(prompt, config.model)
        default:
          throw new Error(`Provider ${config.provider} not yet implemented`)
      }
    } catch (error) {
      console.error(`Error with ${config.provider}:`, error)

      if (config.fallback) {
        console.log(`Falling back to ${config.fallback.provider}`)
        return this.generateText(prompt, {
          provider: config.fallback.provider,
          model: config.fallback.model,
        })
      }

      throw error
    }
  }

  async streamText(prompt: string, config: ModelConfig, onChunk?: (text: string) => void): Promise<string> {
    try {
      switch (config.provider) {
        case "openai":
          return await openaiStream(prompt, config.model, onChunk)
        case "google":
          return await googleStream(prompt, config.model, onChunk)
        default:
          throw new Error(`Provider ${config.provider} not yet implemented`)
      }
    } catch (error) {
      console.error(`Error with ${config.provider}:`, error)

      if (config.fallback) {
        console.log(`Falling back to ${config.fallback.provider}`)
        return this.streamText(
          prompt,
          {
            provider: config.fallback.provider,
            model: config.fallback.model,
          },
          onChunk,
        )
      }

      throw error
    }
  }

  isProviderAvailable(provider: AIProvider): boolean {
    switch (provider) {
      case "openai":
        return !!process.env.OPENAI_API_KEY
      case "google":
        return !!process.env.GOOGLE_AI_API_KEY
      case "anthropic":
        return !!process.env.ANTHROPIC_API_KEY
      case "groq":
        return !!process.env.GROQ_API_KEY
      case "xai":
        return !!process.env.XAI_API_KEY
      case "openrouter":
        return !!process.env.OPENROUTER_API_KEY
      default:
        return false
    }
  }
}

export const modelManager = ModelManager.getInstance()

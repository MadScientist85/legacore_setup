import OpenAI from "openai"
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions"
import type { AIProvider, AIMessage, AIResponse, StreamOptions } from "../types"

export class OpenAIProvider implements AIProvider {
  name = "openai" as const
  private client: OpenAI
  private defaultModel: string

  constructor(apiKey: string, defaultModel = "gpt-4o") {
    if (!apiKey) {
      throw new Error("OpenAI API key is required")
    }

    this.client = new OpenAI({
      apiKey,
      timeout: 60000,
      maxRetries: 3,
    })

    this.defaultModel = defaultModel
  }

  async generateText(
    messages: AIMessage[],
    options: {
      model?: string
      temperature?: number
      maxTokens?: number
    } = {},
  ): Promise<AIResponse> {
    const { model = this.defaultModel, temperature = 0.7, maxTokens = 4000 } = options

    const startTime = Date.now()

    try {
      const completion = await this.client.chat.completions.create({
        model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })) as ChatCompletionMessageParam[],
        temperature,
        max_tokens: maxTokens,
      })

      const content = completion.choices[0]?.message?.content || ""
      const usage = completion.usage

      return {
        content,
        model,
        provider: "openai",
        tokensUsed: usage?.total_tokens || 0,
        cost: this.calculateCost(model, usage?.prompt_tokens || 0, usage?.completion_tokens || 0),
        latencyMs: Date.now() - startTime,
      }
    } catch (error) {
      console.error("OpenAI API error:", error)
      throw new Error(`OpenAI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async *streamText(messages: AIMessage[], options: StreamOptions = {}): AsyncGenerator<string, void, unknown> {
    const { model = this.defaultModel, temperature = 0.7, maxTokens = 4000 } = options

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })) as ChatCompletionMessageParam[],
        temperature,
        max_tokens: maxTokens,
        stream: true,
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          yield content
        }
      }
    } catch (error) {
      console.error("OpenAI streaming error:", error)
      throw new Error(`OpenAI streaming failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private calculateCost(model: string, promptTokens: number, completionTokens: number): number {
    // OpenAI pricing as of 2024
    const pricing: Record<string, { prompt: number; completion: number }> = {
      "gpt-4o": { prompt: 0.005, completion: 0.015 },
      "gpt-4o-mini": { prompt: 0.00015, completion: 0.0006 },
      "gpt-4-turbo": { prompt: 0.01, completion: 0.03 },
      "gpt-3.5-turbo": { prompt: 0.0005, completion: 0.0015 },
    }

    const modelPricing = pricing[model] || pricing["gpt-4o"]
    return (promptTokens / 1000) * modelPricing.prompt + (completionTokens / 1000) * modelPricing.completion
  }
}

// Singleton instance
let openaiProvider: OpenAIProvider | null = null

export function getOpenAIClient(apiKey?: string, model?: string): OpenAIProvider {
  if (!openaiProvider) {
    const key = apiKey || process.env.OPENAI_API_KEY
    if (!key) {
      throw new Error("OpenAI API key is required")
    }
    openaiProvider = new OpenAIProvider(key, model)
  }
  return openaiProvider
}

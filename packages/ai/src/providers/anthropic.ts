import Anthropic from "@anthropic-ai/sdk"
import type { AIMessage, CompletionOptions } from "./model-manager"

export class AnthropicClient {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async complete(messages: AIMessage[], options: CompletionOptions) {
    const systemMessage = messages.find((m) => m.role === "system")
    const otherMessages = messages.filter((m) => m.role !== "system")

    const response = await this.client.messages.create({
      model: options.model || "claude-3-5-sonnet-20241022",
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.7,
      system: systemMessage?.content || options.systemPrompt,
      messages: otherMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    })

    return {
      output: response.content[0]?.type === "text" ? response.content[0].text : "",
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      model: response.model,
      cost: this.calculateCost(response.usage.input_tokens + response.usage.output_tokens),
    }
  }

  async *stream(messages: AIMessage[], options: CompletionOptions): AsyncGenerator<string, void, unknown> {
    const systemMessage = messages.find((m) => m.role === "system")
    const otherMessages = messages.filter((m) => m.role !== "system")

    const stream = await this.client.messages.stream({
      model: options.model || "claude-3-5-sonnet-20241022",
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.7,
      system: systemMessage?.content || options.systemPrompt,
      messages: otherMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    })

    for await (const chunk of stream) {
      if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
        yield chunk.delta.text
      }
    }
  }

  private calculateCost(tokens: number): number {
    return tokens * 0.000025
  }
}

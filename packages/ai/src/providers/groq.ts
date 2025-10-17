import Groq from "groq-sdk"
import type { AIMessage, CompletionOptions } from "./model-manager"

export class GroqClient {
  private client: Groq

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }

  async complete(messages: AIMessage[], options: CompletionOptions) {
    const completion = await this.client.chat.completions.create({
      model: options.model || "llama-3.3-70b-versatile",
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
    })

    return {
      output: completion.choices[0]?.message?.content || "",
      tokensUsed: completion.usage?.total_tokens || 0,
      model: completion.model,
      cost: 0, // Groq is free tier
    }
  }

  async *stream(messages: AIMessage[], options: CompletionOptions): AsyncGenerator<string, void, unknown> {
    const stream = await this.client.chat.completions.create({
      model: options.model || "llama-3.3-70b-versatile",
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        yield content
      }
    }
  }
}

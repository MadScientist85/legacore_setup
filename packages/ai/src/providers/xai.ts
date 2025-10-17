import type { AIMessage, CompletionOptions } from "./model-manager"

export class XAIClient {
  private apiKey: string
  private baseUrl = "https://api.x.ai/v1"

  constructor() {
    this.apiKey = process.env.XAI_API_KEY || ""
  }

  async complete(messages: AIMessage[], options: CompletionOptions) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || "grok-beta",
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
      }),
    })

    const data = await response.json()

    return {
      output: data.choices[0]?.message?.content || "",
      tokensUsed: data.usage?.total_tokens || 0,
      model: data.model,
      cost: this.calculateCost(data.usage?.total_tokens || 0),
    }
  }

  async *stream(messages: AIMessage[], options: CompletionOptions): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || "grok-beta",
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        stream: true,
      }),
    })

    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter((line) => line.trim() !== "")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") return

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0]?.delta?.content
            if (content) yield content
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }

  private calculateCost(tokens: number): number {
    return tokens * 0.00005
  }
}

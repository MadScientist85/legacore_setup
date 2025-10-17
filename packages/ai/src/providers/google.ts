import { GoogleGenerativeAI } from "@google/generative-ai"
import type { AIMessage, CompletionOptions } from "./model-manager"

export class GoogleClient {
  private client: GoogleGenerativeAI

  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "")
  }

  async complete(messages: AIMessage[], options: CompletionOptions) {
    const model = this.client.getGenerativeModel({ model: options.model || "gemini-1.5-pro" })

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    })

    const lastMessage = messages[messages.length - 1]
    const result = await chat.sendMessage(lastMessage.content)
    const response = result.response

    return {
      output: response.text(),
      tokensUsed: 0, // Google doesn't provide token count in basic API
      model: options.model || "gemini-1.5-pro",
      cost: 0,
    }
  }

  async *stream(messages: AIMessage[], options: CompletionOptions): AsyncGenerator<string, void, unknown> {
    const model = this.client.getGenerativeModel({ model: options.model || "gemini-1.5-pro" })

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    })

    const lastMessage = messages[messages.length - 1]
    const result = await chat.sendMessageStream(lastMessage.content)

    for await (const chunk of result.stream) {
      yield chunk.text()
    }
  }
}

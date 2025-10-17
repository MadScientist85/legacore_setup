import type { AIMessage } from "../ai/openai-client"

export class TokenCounter {
  // Rough estimation: 1 token ≈ 4 characters for English text
  private readonly CHARS_PER_TOKEN = 4

  estimateTokens(messages: AIMessage[]): number {
    const totalChars = messages.reduce((sum, message) => {
      return sum + message.content.length + message.role.length + 10 // +10 for formatting
    }, 0)

    return Math.ceil(totalChars / this.CHARS_PER_TOKEN)
  }

  estimateTokensFromText(text: string): number {
    return Math.ceil(text.length / this.CHARS_PER_TOKEN)
  }

  // More accurate token counting for specific models (if needed)
  countTokensAccurate(text: string, model = "gpt-4"): number {
    // This would integrate with tiktoken or similar library for exact counting
    // For now, using estimation
    return this.estimateTokensFromText(text)
  }
}

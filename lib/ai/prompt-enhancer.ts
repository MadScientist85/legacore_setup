import { generateText } from "./openai-client"

export class PromptEnhancer {
  async enhancePrompt(originalPrompt: string, context?: string): Promise<string> {
    const systemPrompt = `You are an expert prompt engineer. Your task is to enhance user prompts to make them more specific, detailed, and effective for AI models.

Rules:
- Add relevant details and context
- Make the prompt more specific and actionable
- Include quality descriptors
- Maintain the original intent
- Keep it concise but comprehensive
- Return ONLY the enhanced prompt, nothing else`

    const userPrompt = context
      ? `Original prompt: "${originalPrompt}"\nContext: ${context}\n\nEnhance this prompt:`
      : `Original prompt: "${originalPrompt}"\n\nEnhance this prompt:`

    try {
      const enhanced = await generateText(userPrompt, "gpt-4o", systemPrompt)
      return enhanced.trim()
    } catch (error) {
      console.error("Prompt enhancement error:", error)
      return originalPrompt
    }
  }

  async generatePromptSuggestions(topic: string, count = 5): Promise<string[]> {
    const systemPrompt = `You are a creative prompt generator. Generate diverse, interesting prompts for the given topic.
Return a JSON array of strings, nothing else.`

    const userPrompt = `Generate ${count} creative and diverse prompts about: ${topic}`

    try {
      const response = await generateText(userPrompt, "gpt-4o", systemPrompt)
      const suggestions = JSON.parse(response)
      return Array.isArray(suggestions) ? suggestions.slice(0, count) : []
    } catch (error) {
      console.error("Prompt suggestion error:", error)
      return []
    }
  }

  async analyzePrompt(prompt: string): Promise<{
    quality: "poor" | "fair" | "good" | "excellent"
    suggestions: string[]
    score: number
  }> {
    const systemPrompt = `Analyze the quality of this prompt and provide improvement suggestions.
Return a JSON object with: quality (poor/fair/good/excellent), suggestions (array of strings), score (0-100).`

    try {
      const response = await generateText(`Analyze this prompt: "${prompt}"`, "gpt-4o", systemPrompt)
      return JSON.parse(response)
    } catch (error) {
      console.error("Prompt analysis error:", error)
      return {
        quality: "fair",
        suggestions: ["Could not analyze prompt"],
        score: 50,
      }
    }
  }
}

export const promptEnhancer = new PromptEnhancer()

import { GoogleGenerativeAI } from "@google/generative-ai"

let googleInstance: GoogleGenerativeAI | null = null

export function getGoogleClient(): GoogleGenerativeAI {
  if (!googleInstance) {
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY is not set in environment variables")
    }

    googleInstance = new GoogleGenerativeAI(apiKey)
  }

  return googleInstance
}

export async function generateText(prompt: string, model = "gemini-pro"): Promise<string> {
  const client = getGoogleClient()
  const generativeModel = client.getGenerativeModel({ model })

  try {
    const result = await generativeModel.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Google AI generateText error:", error)
    throw new Error("Failed to generate text with Google AI")
  }
}

export async function streamText(
  prompt: string,
  model = "gemini-pro",
  onChunk?: (text: string) => void,
): Promise<string> {
  const client = getGoogleClient()
  const generativeModel = client.getGenerativeModel({ model })

  try {
    const result = await generativeModel.generateContentStream(prompt)
    let fullText = ""

    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      fullText += chunkText
      if (onChunk && chunkText) {
        onChunk(chunkText)
      }
    }

    return fullText
  } catch (error) {
    console.error("Google AI streamText error:", error)
    throw new Error("Failed to stream text with Google AI")
  }
}

export async function generateWithChat(
  messages: Array<{ role: string; content: string }>,
  model = "gemini-pro",
): Promise<string> {
  const client = getGoogleClient()
  const generativeModel = client.getGenerativeModel({ model })

  try {
    const chat = generativeModel.startChat({
      history: messages.slice(0, -1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    })

    const lastMessage = messages[messages.length - 1]
    const result = await chat.sendMessage(lastMessage.content)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Google AI chat error:", error)
    throw new Error("Failed to generate chat response with Google AI")
  }
}

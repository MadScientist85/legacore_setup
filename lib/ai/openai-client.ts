import OpenAI from "openai"

let openaiInstance: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }

    openaiInstance = new OpenAI({
      apiKey: apiKey,
    })
  }

  return openaiInstance
}

export async function generateText(prompt: string, model = "gpt-4o", systemPrompt?: string): Promise<string> {
  const openai = getOpenAIClient()

  try {
    const messages: Array<{ role: "system" | "user"; content: string }> = []

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt })
    }

    messages.push({ role: "user", content: prompt })

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || ""
  } catch (error) {
    console.error("Error generating text:", error)
    throw error
  }
}

export async function streamText(
  prompt: string,
  model = "gpt-4o",
  systemPrompt?: string,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const openai = getOpenAIClient()

  try {
    const messages: Array<{ role: "system" | "user"; content: string }> = []

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt })
    }

    messages.push({ role: "user", content: prompt })

    const stream = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
      stream: true,
    })

    let fullText = ""

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ""
      fullText += content
      if (onChunk) {
        onChunk(content)
      }
    }

    return fullText
  } catch (error) {
    console.error("Error streaming text:", error)
    throw error
  }
}

export async function runAgentPrompt(prompt: string, model = "gpt-4o", systemPrompt?: string): Promise<string> {
  const openai = getOpenAIClient()

  try {
    const messages: Array<{ role: "system" | "user"; content: string }> = []

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt })
    }

    messages.push({ role: "user", content: prompt })

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || ""
  } catch (error) {
    console.error("Error running agent prompt:", error)
    throw error
  }
}

export async function runAgentStream(
  prompt: string,
  model = "gpt-4o",
  systemPrompt?: string,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const openai = getOpenAIClient()

  try {
    const messages: Array<{ role: "system" | "user"; content: string }> = []

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt })
    }

    messages.push({ role: "user", content: prompt })

    const stream = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
      stream: true,
    })

    let fullText = ""

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ""
      fullText += content
      if (onChunk) {
        onChunk(content)
      }
    }

    return fullText
  } catch (error) {
    console.error("Error streaming agent response:", error)
    throw error
  }
}

export async function generateWithFunctions(prompt: string, functions: any[], model = "gpt-4o"): Promise<any> {
  const openai = getOpenAIClient()

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      functions: functions,
      function_call: "auto",
    })

    return completion.choices[0]
  } catch (error) {
    console.error("Error generating with functions:", error)
    throw error
  }
}

export async function generateStructuredOutput<T>(prompt: string, schema: any, model = "gpt-4o"): Promise<T> {
  const openai = getOpenAIClient()

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content || "{}"
    return JSON.parse(content) as T
  } catch (error) {
    console.error("OpenAI structured output error:", error)
    throw error
  }
}

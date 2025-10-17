import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
})

// Create assistant
export const createAssistant = async (agentConfig) => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: agentConfig.name,
      instructions: agentConfig.systemPrompt,
      model: "gpt-4-1106-preview",
      tools:
        agentConfig.functions?.map((func) => ({
          type: "function",
          function: func,
        })) || [],
    })

    return assistant
  } catch (error) {
    console.error("Error creating assistant:", error)
    throw error
  }
}

// Run assistant
export const runAssistant = async (assistantId, threadId, message) => {
  try {
    // Add message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    })

    // Run assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    })

    return run
  } catch (error) {
    console.error("Error running assistant:", error)
    throw error
  }
}

// Get run status
export const getRunStatus = async (threadId, runId) => {
  try {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId)
    return run
  } catch (error) {
    console.error("Error getting run status:", error)
    throw error
  }
}

// Get messages
export const getMessages = async (threadId) => {
  try {
    const messages = await openai.beta.threads.messages.list(threadId)
    return messages.data
  } catch (error) {
    console.error("Error getting messages:", error)
    throw error
  }
}

// Create thread
export const createThread = async () => {
  try {
    const thread = await openai.beta.threads.create()
    return thread
  } catch (error) {
    console.error("Error creating thread:", error)
    throw error
  }
}

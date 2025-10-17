"use client"

import { useState, useCallback } from "react"

interface UseAgentStreamReturn {
  streamAgent: (
    agentId: string,
    message: string,
    onChunk: (chunk: string) => void,
    conversationId?: string,
  ) => Promise<{ conversationId: string; fullResponse: string }>
  loading: boolean
  error: string | null
  reset: () => void
}

export function useAgentStream(): UseAgentStreamReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const streamAgent = useCallback(
    async (
      agentId: string,
      message: string,
      onChunk: (chunk: string) => void,
      conversationId?: string,
    ): Promise<{ conversationId: string; fullResponse: string }> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/chat/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agentId,
            message,
            conversationId,
            companyId: "default", // You can make this dynamic
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to stream response")
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullResponse = ""
        let finalConversationId = conversationId || ""

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6))

                  if (data.type === "content") {
                    fullResponse += data.content
                    onChunk(data.content)
                  } else if (data.type === "done") {
                    finalConversationId = data.conversationId
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        }

        setLoading(false)
        return { conversationId: finalConversationId, fullResponse }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        setError(errorMessage)
        setLoading(false)
        throw err
      }
    },
    [],
  )

  const reset = () => {
    setLoading(false)
    setError(null)
  }

  return {
    streamAgent,
    loading,
    error,
    reset,
  }
}

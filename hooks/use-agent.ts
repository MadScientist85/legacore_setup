"use client"

import { useState } from "react"

interface UseAgentReturn {
  runAgent: (agentId: string, input: string) => Promise<void>
  loading: boolean
  error: string | null
  output: string | null
  reset: () => void
}

export function useAgent(): UseAgentReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)

  const runAgent = async (agentId: string, input: string) => {
    setLoading(true)
    setError(null)
    setOutput(null)

    try {
      const response = await fetch("/api/agents/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId, input }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to run agent")
      }

      setOutput(data.output || data.text || "")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Agent execution error:", err)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setLoading(false)
    setError(null)
    setOutput(null)
  }

  return {
    runAgent,
    loading,
    error,
    output,
    reset,
  }
}

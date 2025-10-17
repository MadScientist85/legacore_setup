"use client"

import { useState, useEffect } from "react"
import type { AgentRunHistory } from "@/types/agent"

interface UseAgentHistoryReturn {
  history: AgentRunHistory[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useAgentHistory(limit = 10): UseAgentHistoryReturn {
  const [history, setHistory] = useState<AgentRunHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/agents/history?limit=${limit}`)

      if (!response.ok) {
        throw new Error("Failed to fetch history")
      }

      const data = await response.json()
      setHistory(data.runs || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Failed to fetch agent history:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [limit])

  return {
    history,
    loading,
    error,
    refresh: fetchHistory,
  }
}

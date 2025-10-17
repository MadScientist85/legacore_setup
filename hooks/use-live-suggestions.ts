"use client"

import { useState, useEffect } from "react"
import { debounce } from "@/lib/utils/debounce"

export interface Suggestion {
  id: string
  text: string
  type: "completion" | "correction" | "enhancement"
  score: number
}

export function useLiveSuggestions(text: string, enabled = true) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!enabled || !text || text.length < 3) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = debounce(async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/ai/suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        })

        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.suggestions || [])
        }
      } catch (error) {
        console.error("Suggestions error:", error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 500)

    fetchSuggestions()
  }, [text, enabled])

  return { suggestions, isLoading }
}

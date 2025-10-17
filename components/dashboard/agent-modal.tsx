"use client"

import type React from "react"

import { useState } from "react"
import type { AgentConfig } from "@/types/agent"
import { useAgent } from "@/hooks/use-agent"
import { X, Send, Loader2 } from "lucide-react"

interface AgentModalProps {
  agent: AgentConfig
  onClose: () => void
}

export function AgentModal({ agent, onClose }: AgentModalProps) {
  const [input, setInput] = useState("")
  const { runAgent, loading, error, result, reset } = useAgent()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    await runAgent(agent.id, input.trim())
  }

  const handleReset = () => {
    reset()
    setInput("")
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-aurelian-purple rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-aurelian-gold">{agent.name}</h2>
            <p className="text-sm text-gray-400 mt-1">{agent.description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Request</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask ${agent.name} anything...`}
                  className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-aurelian-gold focus:border-transparent resize-none"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-full bg-aurelian-purple hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Run Agent
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Your Input:</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-white whitespace-pre-wrap">{input}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Agent Response:</h3>
                <div className="bg-gray-800 border border-aurelian-purple rounded-lg p-4">
                  <p className="text-white whitespace-pre-wrap">{result.output}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Tokens: {result.tokensUsed}</span>
                <span>Duration: {result.durationMs}ms</span>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Ask Another Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import type { AgentConfig } from "@/types/agent"
import { Sparkles } from "lucide-react"

interface AgentCardProps {
  agent: AgentConfig
  onClick: () => void
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gray-900 border border-aurelian-purple rounded-lg p-6 text-left hover:border-aurelian-gold transition-colors group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="bg-aurelian-purple/20 p-3 rounded-lg group-hover:bg-aurelian-gold/20 transition-colors">
          <Sparkles className="w-6 h-6 text-aurelian-gold" />
        </div>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{agent.model}</span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-aurelian-gold transition-colors">
        {agent.name}
      </h3>

      <p className="text-sm text-gray-400 line-clamp-2">{agent.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-aurelian-purple font-medium">{agent.category}</span>
        <span className="text-xs text-gray-500">v{agent.version}</span>
      </div>
    </button>
  )
}

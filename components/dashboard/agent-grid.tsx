"use client"

import { useState } from "react"
import { getActiveAgents } from "@/lib/agents/registry"
import { AgentCard } from "./agent-card"
import { AgentModal } from "./agent-modal"
import type { AgentConfig } from "@/types/agent"

export function AgentGrid() {
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null)
  const agents = getActiveAgents()

  // Group agents by category
  const agentsByCategory = agents.reduce(
    (acc, agent) => {
      const category = agent.category || "Other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(agent)
      return acc
    },
    {} as Record<string, AgentConfig[]>,
  )

  return (
    <>
      <div className="space-y-8">
        {Object.entries(agentsByCategory).map(([category, categoryAgents]) => (
          <div key={category}>
            <h2 className="text-xl font-bold text-aurelian-gold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedAgent && <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
    </>
  )
}

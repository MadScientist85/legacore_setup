"use client"

import { useAgentHistory } from "@/hooks/use-agent-history"
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"

export function AgentHistoryPanel() {
  const { history, loading, error, refresh } = useAgentHistory(10)

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-aurelian-gold animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Recent Activity</h2>
        <button onClick={refresh} className="text-xs text-aurelian-gold hover:text-gold-400 transition-colors">
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No recent activity</p>
        ) : (
          history.map((run) => (
            <div key={run.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-white">{run.agentName}</span>
                {run.status === "completed" && <CheckCircle className="w-4 h-4 text-green-400" />}
                {run.status === "failed" && <XCircle className="w-4 h-4 text-red-400" />}
                {run.status === "pending" && <Clock className="w-4 h-4 text-yellow-400" />}
              </div>

              <p className="text-xs text-gray-400 mb-2 line-clamp-2">{run.input}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(run.createdAt).toLocaleDateString()}</span>
                {run.tokensUsed && <span>{run.tokensUsed} tokens</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

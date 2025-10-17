"use client"

import type { DatabaseStatus } from "@/lib/admin/schemas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Activity } from "lucide-react"

interface DatabaseStatusProps {
  databases: DatabaseStatus[]
}

export function DatabaseStatusCard({ databases }: DatabaseStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "disconnected":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getTypeIcon = (type: string) => {
    return <Database className="h-5 w-5" />
  }

  const formatLatency = (latency: number | null) => {
    if (latency === null) return "N/A"
    return `${latency}ms`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status
        </CardTitle>
        <CardDescription>Monitor all database connections and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {databases.map((db) => (
            <div
              key={db.name}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getTypeIcon(db.type)}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{db.name}</h4>
                    <Badge className={getStatusColor(db.status)}>{db.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">{db.type}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  <span>{formatLatency(db.latency)}</span>
                </div>
                {db.error_message && <p className="text-xs text-red-500 mt-1">{db.error_message}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

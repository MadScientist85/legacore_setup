"use client"

import type { DatabaseHealth } from "@/lib/health/schemas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface DatabaseChecksProps {
  health: DatabaseHealth
}

export function DatabaseChecks({ health }: DatabaseChecksProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "unhealthy":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "degraded":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "unhealthy":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const databases = [health.supabase, health.mongodb, health.redis, health.postgres].filter(Boolean)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connectivity
        </CardTitle>
        <CardDescription>Live status of all database connections</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {databases.map((db) => (
            <div
              key={db.service}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(db.status)}
                <div>
                  <h4 className="font-semibold">{db.service}</h4>
                  {db.latency_ms && (
                    <p className="text-sm text-muted-foreground">Latency: {db.latency_ms}ms</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusBadgeClass(db.status)}>{db.status}</Badge>
                {db.error && <p className="text-xs text-red-500 mt-1">{db.error}</p>}
                {db.details && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {Object.entries(db.details).map(([key, value]) => (
                      <div key={key}>
                        {key}: {String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

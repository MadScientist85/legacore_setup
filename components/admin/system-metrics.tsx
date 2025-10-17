"use client"

import type { SystemMetrics } from "@/lib/admin/schemas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Clock, GitBranch, Package } from "lucide-react"

interface SystemMetricsCardProps {
  metrics: SystemMetrics
}

export function SystemMetricsCard({ metrics }: SystemMetricsCardProps) {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "production":
        return "text-green-500"
      case "staging":
        return "text-yellow-500"
      case "development":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          System Metrics
        </CardTitle>
        <CardDescription>Platform performance and deployment information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Uptime */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Uptime</span>
            </div>
            <span className="text-sm font-semibold">{formatUptime(metrics.uptime_seconds)}</span>
          </div>

          {/* Environment */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Environment</span>
            </div>
            <span className={`text-sm font-semibold capitalize ${getEnvironmentColor(metrics.environment)}`}>
              {metrics.environment}
            </span>
          </div>

          {/* Version & Commit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Version</span>
              </div>
              <span className="text-sm font-semibold">{metrics.version}</span>
            </div>
            {metrics.commit_sha && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Commit SHA</span>
                </div>
                <span className="text-sm font-mono">{metrics.commit_sha.substring(0, 8)}</span>
              </div>
            )}
          </div>

          {/* Deployment Info */}
          {metrics.deployed_at && (
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-muted-foreground">Last Deployed</p>
              <p className="text-sm font-semibold">{formatDate(metrics.deployed_at)}</p>
            </div>
          )}

          {/* Tech Stack */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Node.js</p>
              <p className="text-sm font-semibold">{metrics.node_version}</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Next.js</p>
              <p className="text-sm font-semibold">{metrics.next_version}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

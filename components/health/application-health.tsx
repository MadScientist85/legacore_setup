"use client"

import type { ApplicationHealth } from "@/lib/health/schemas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface ApplicationHealthInfoProps {
  health: ApplicationHealth
}

export function ApplicationHealthInfo({ health }: ApplicationHealthInfoProps) {
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

  const services = [health.api, health.background_jobs, health.queue, health.websocket].filter(Boolean)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Application Health
        </CardTitle>
        <CardDescription>Service availability and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.service}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <div>
                  <h4 className="font-semibold">{service.service}</h4>
                  {service.latency_ms && (
                    <p className="text-sm text-muted-foreground">Response time: {service.latency_ms}ms</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusBadgeClass(service.status)}>{service.status}</Badge>
                {service.error && <p className="text-xs text-red-500 mt-1">{service.error}</p>}
                {service.details && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {Object.entries(service.details).map(([key, value]) => (
                      <div key={key}>
                        {key.replace(/_/g, " ")}: {String(value)}
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

"use client"

import type { StorageHealth } from "@/lib/health/schemas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { HardDrive, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface StorageStatusProps {
  storage: StorageHealth
}

export function StorageStatus({ storage }: StorageStatusProps) {
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

  const usagePercentage = (storage.used_storage_mb / storage.total_storage_mb) * 100
  const formatSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`
    }
    return `${mb.toFixed(2)} MB`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Storage Status
        </CardTitle>
        <CardDescription>Vercel Blob storage health and usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Storage Service Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(storage.vercel_blob.status)}
              <div>
                <h4 className="font-semibold">{storage.vercel_blob.service}</h4>
                {storage.vercel_blob.latency_ms && (
                  <p className="text-sm text-muted-foreground">Latency: {storage.vercel_blob.latency_ms}ms</p>
                )}
              </div>
            </div>
            <Badge className={getStatusBadgeClass(storage.vercel_blob.status)}>{storage.vercel_blob.status}</Badge>
          </div>

          {/* Storage Details */}
          {storage.vercel_blob.details && (
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="space-y-1 text-sm">
                {Object.entries(storage.vercel_blob.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key.replace(/_/g, " ")}:</span>
                    <span className="font-semibold">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Storage Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Storage Usage</span>
              <span className="font-semibold">{usagePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatSize(storage.used_storage_mb)} used</span>
              <span>{formatSize(storage.total_storage_mb)} total</span>
            </div>
          </div>

          {/* Available Storage */}
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">Available Storage</p>
            <p className="text-2xl font-bold">{formatSize(storage.available_storage_mb)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

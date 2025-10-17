"use client"

import type { VersionInfo } from "@/lib/health/schemas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, GitCommit, Tag, Calendar, Package } from "lucide-react"

interface VersionInfoCardProps {
  version: VersionInfo
}

export function VersionInfoCard({ version }: VersionInfoCardProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Version Information
        </CardTitle>
        <CardDescription>Current deployment version and build details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Commit SHA */}
          {version.commit_sha && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <GitCommit className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Commit SHA</span>
              </div>
              <span className="text-sm font-mono">{version.commit_sha}</span>
            </div>
          )}

          {/* Branch */}
          {version.branch && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Branch</span>
              </div>
              <span className="text-sm font-semibold">{version.branch}</span>
            </div>
          )}

          {/* Tag */}
          {version.tag && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Tag</span>
              </div>
              <span className="text-sm font-semibold">{version.tag}</span>
            </div>
          )}

          {/* Deployed At */}
          {version.deployed_at && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Deployed At</span>
              </div>
              <span className="text-sm">{formatDate(version.deployed_at)}</span>
            </div>
          )}

          {/* Build ID */}
          {version.build_id && (
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Build ID</p>
              <p className="text-sm font-mono">{version.build_id}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

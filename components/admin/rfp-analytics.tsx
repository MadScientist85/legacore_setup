"use client"

import type { RFPAnalytics } from "@/lib/admin/schemas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, Clock, CheckCircle } from "lucide-react"

interface RFPAnalyticsSummaryProps {
  analytics: RFPAnalytics
}

export function RFPAnalyticsSummary({ analytics }: RFPAnalyticsSummaryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500"
      case "active":
        return "text-blue-500"
      case "pending":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          RFP Analytics
        </CardTitle>
        <CardDescription>Request for Proposal processing statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total RFPs</p>
              <p className="text-2xl font-bold">{analytics.total_rfps}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-blue-500">{analytics.active_rfps}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-500">{analytics.completed_rfps}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{analytics.success_rate}%</p>
            </div>
          </div>

          {/* Avg Completion Time */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Average Completion Time</p>
              <p className="text-sm text-muted-foreground">{analytics.avg_completion_time_hours} hours</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Activity
            </h4>
            <div className="space-y-2">
              {analytics.recent_activity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(item.status)}`}>
                    {item.status === "completed" && <CheckCircle className="h-4 w-4" />}
                    <span className="text-xs font-medium capitalize">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

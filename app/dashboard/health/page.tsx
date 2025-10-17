import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DatabaseChecks } from "@/components/health/database-checks"
import { ApplicationHealthInfo } from "@/components/health/application-health"
import { StorageStatus } from "@/components/health/storage-status"
import { VersionInfoCard } from "@/components/health/version-info"
import { getOverallHealth } from "@/lib/health/checks"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Health Dashboard | LegaCore Platform",
  description: "System health monitoring and status checks",
}

async function HealthDashboardContent() {
  const health = await getOverallHealth()

  const getOverallStatusColor = (status: string) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Dashboard</h1>
          <p className="text-muted-foreground">Real-time system health monitoring and diagnostics</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overall Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Overall System Status
          </CardTitle>
          <CardDescription>Last checked: {new Date(health.timestamp).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge className={`${getOverallStatusColor(health.status)} text-lg px-4 py-2`}>
              {health.status.toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground">All critical systems are being monitored</p>
          </div>
        </CardContent>
      </Card>

      {/* Health Checks Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <DatabaseChecks health={health.database} />
        <ApplicationHealthInfo health={health.application} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StorageStatus storage={health.storage} />
        <VersionInfoCard version={health.version} />
      </div>
    </div>
  )
}

export default async function HealthDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // TODO: Add role-based access control for health dashboard
  // Health dashboard might be accessible to admins and managers

  return (
    <div className="container mx-auto px-6 py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <div className="text-lg">Loading health dashboard...</div>
          </div>
        }
      >
        <HealthDashboardContent />
      </Suspense>
    </div>
  )
}

import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { UserManagement } from "@/components/admin/user-management"
import { DatabaseStatusCard } from "@/components/admin/database-status"
import { AIProviderStatus } from "@/components/admin/ai-provider-status"
import { RFPAnalyticsSummary } from "@/components/admin/rfp-analytics"
import { SystemMetricsCard } from "@/components/admin/system-metrics"
import { getUsers, getDatabaseStatus, getAIProviderStatus, getRFPAnalytics, getSystemMetrics } from "@/lib/admin/services"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Database, Sparkles, FileText, Server } from "lucide-react"

export const metadata = {
  title: "Admin Dashboard | LegaCore Platform",
  description: "Administration dashboard for platform management",
}

async function AdminDashboardContent() {
  // Fetch all admin data
  const [users, databases, aiProviders, rfpAnalytics, systemMetrics] = await Promise.all([
    getUsers(),
    getDatabaseStatus(),
    getAIProviderStatus(),
    getRFPAnalytics(),
    getSystemMetrics(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive platform administration and monitoring</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <Settings className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Providers
          </TabsTrigger>
          <TabsTrigger value="system">
            <Server className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SystemMetricsCard metrics={systemMetrics} />
            <RFPAnalyticsSummary analytics={rfpAnalytics} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <DatabaseStatusCard databases={databases} />
            <AIProviderStatus providers={aiProviders} />
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement users={users} />
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <DatabaseStatusCard databases={databases} />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <AIProviderStatus providers={aiProviders} />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SystemMetricsCard metrics={systemMetrics} />
            <RFPAnalyticsSummary analytics={rfpAnalytics} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // TODO: Add role-based access control
  // if (session.user.role !== "admin") {
  //   redirect("/dashboard")
  // }

  return (
    <div className="container mx-auto px-6 py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <div className="text-lg">Loading admin dashboard...</div>
          </div>
        }
      >
        <AdminDashboardContent />
      </Suspense>
    </div>
  )
}

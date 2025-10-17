"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { OverviewStats } from "@/components/analytics/overview-stats"
import { RevenueChart } from "@/components/analytics/revenue-chart"
import { SubscriptionBreakdown } from "@/components/analytics/subscription-breakdown"
import { UserGrowthChart } from "@/components/analytics/user-growth-chart"
import { DocumentStats } from "@/components/analytics/document-stats"
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts"

export default function AnalyticsPage() {
  const [overviewData, setOverviewData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [documentData, setDocumentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, userRes, docRes] = await Promise.all([
        fetch("/api/analytics/overview"),
        fetch("/api/analytics/users"),
        fetch("/api/analytics/documents"),
      ])

      const overview = await overviewRes.json()
      const users = await userRes.json()
      const documents = await docRes.json()

      setOverviewData(overview)
      setUserData(users)
      setDocumentData(documents)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: string) => {
    try {
      const res = await fetch(`/api/analytics/export?type=${type}`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}-export-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to export:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your platform</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleExport("revenue")} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Revenue
          </Button>
          <Button onClick={() => handleExport("users")} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button onClick={() => handleExport("documents")} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Documents
          </Button>
        </div>
      </div>

      {overviewData && <OverviewStats data={overviewData.overview} />}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {overviewData?.revenueChart && <RevenueChart data={overviewData.revenueChart} />}
            {overviewData?.subscriptionBreakdown && <SubscriptionBreakdown data={overviewData.subscriptionBreakdown} />}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {userData?.userGrowth && <UserGrowthChart data={userData.userGrowth} />}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Users by Role</h3>
              <div className="space-y-2">
                {userData?.roleBreakdown &&
                  Object.entries(userData.roleBreakdown).map(([role, count]: [string, any]) => (
                    <div key={role} className="flex justify-between">
                      <span className="capitalize">{role}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Active Users</h3>
              <div className="text-4xl font-bold text-green-500">{userData?.activeUsers || 0}</div>
              <p className="text-sm text-muted-foreground mt-2">Logged in within last 7 days</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {documentData?.categoryBreakdown && (
            <DocumentStats data={documentData.categoryBreakdown} totalStorage={documentData.totalStorage} />
          )}
          {documentData?.uploadTrend && (
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Document Upload Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={documentData.uploadTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

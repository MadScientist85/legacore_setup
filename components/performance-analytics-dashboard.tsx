"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Activity, DollarSign, Clock, CheckCircle, Zap, Target } from "lucide-react"

interface PerformanceMetrics {
  totalRequests: number
  successRate: number
  averageResponseTime: number
  revenue: number
  activeUsers: number
  tasksCompleted: number
  uptime: number
  errorRate: number
}

interface VerticalMetrics {
  id: string
  name: string
  metrics: PerformanceMetrics
  trend: "up" | "down" | "stable"
  trendPercentage: number
}

interface AgentMetrics {
  id: string
  name: string
  category: string
  status: "active" | "paused" | "error"
  metrics: PerformanceMetrics
  efficiency: number
  userSatisfaction: number
}

const mockVerticalMetrics: VerticalMetrics[] = [
  {
    id: "1",
    name: "Surplus Funds Recovery",
    metrics: {
      totalRequests: 15420,
      successRate: 94.2,
      averageResponseTime: 1250,
      revenue: 45231,
      activeUsers: 342,
      tasksCompleted: 1247,
      uptime: 99.8,
      errorRate: 0.8,
    },
    trend: "up",
    trendPercentage: 12.5,
  },
  {
    id: "2",
    name: "Credit Repair Services",
    metrics: {
      totalRequests: 12890,
      successRate: 89.1,
      averageResponseTime: 980,
      revenue: 32150,
      activeUsers: 278,
      tasksCompleted: 892,
      uptime: 98.5,
      errorRate: 1.2,
    },
    trend: "up",
    trendPercentage: 8.3,
  },
  {
    id: "3",
    name: "Debt Portfolio Management",
    metrics: {
      totalRequests: 8930,
      successRate: 96.7,
      averageResponseTime: 750,
      revenue: 18900,
      activeUsers: 156,
      tasksCompleted: 456,
      uptime: 99.9,
      errorRate: 0.3,
    },
    trend: "stable",
    trendPercentage: 2.1,
  },
]

const mockAgentMetrics: AgentMetrics[] = [
  {
    id: "1",
    name: "Atlas - Surplus Funds Paralegal",
    category: "legal",
    status: "active",
    metrics: {
      totalRequests: 8420,
      successRate: 95.8,
      averageResponseTime: 1100,
      revenue: 28500,
      activeUsers: 189,
      tasksCompleted: 723,
      uptime: 99.9,
      errorRate: 0.5,
    },
    efficiency: 94.2,
    userSatisfaction: 4.7,
  },
  {
    id: "2",
    name: "Lexis - Credit Repair Agent",
    category: "credit",
    status: "active",
    metrics: {
      totalRequests: 7230,
      successRate: 91.3,
      averageResponseTime: 890,
      revenue: 19800,
      activeUsers: 156,
      tasksCompleted: 567,
      uptime: 98.7,
      errorRate: 1.1,
    },
    efficiency: 89.6,
    userSatisfaction: 4.5,
  },
  {
    id: "3",
    name: "Aegis - Debt Buyer Agent",
    category: "debt",
    status: "active",
    metrics: {
      totalRequests: 5670,
      successRate: 97.2,
      averageResponseTime: 650,
      revenue: 12400,
      activeUsers: 89,
      tasksCompleted: 334,
      uptime: 99.8,
      errorRate: 0.2,
    },
    efficiency: 96.8,
    userSatisfaction: 4.8,
  },
]

const performanceData = [
  { name: "Mon", requests: 2400, success: 2280, revenue: 4800 },
  { name: "Tue", requests: 1398, success: 1320, revenue: 3200 },
  { name: "Wed", requests: 9800, success: 9310, revenue: 8900 },
  { name: "Thu", requests: 3908, success: 3720, revenue: 7200 },
  { name: "Fri", requests: 4800, success: 4560, revenue: 9800 },
  { name: "Sat", requests: 3800, success: 3610, revenue: 6400 },
  { name: "Sun", requests: 4300, success: 4085, revenue: 7800 },
]

const COLORS = ["#00BFFF", "#D4AF37", "#0D0D0D", "#FF6B6B", "#4ECDC4", "#45B7D1"]

export function PerformanceAnalyticsDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [selectedVertical, setSelectedVertical] = useState("all")
  const [selectedAgent, setSelectedAgent] = useState("all")

  const getTrendIcon = (trend: string, percentage: number) => {
    if (trend === "up") {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (trend === "down") {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    }
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bebas tracking-wider text-legacore-steel">PERFORMANCE ANALYTICS</h1>
          <p className="text-muted-foreground">Real-time insights across all business verticals and AI agents</p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedVertical} onValueChange={setSelectedVertical}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verticals</SelectItem>
              <SelectItem value="surplus-funds">Surplus Funds</SelectItem>
              <SelectItem value="credit-repair">Credit Repair</SelectItem>
              <SelectItem value="debt-management">Debt Management</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-legacore-steel/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-legacore-steel" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-legacore-steel">37,240</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="border-legacore-steel/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">93.7%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +2.1% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="border-legacore-steel/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-legacore-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-legacore-gold">$96,281</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +18.3% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="border-legacore-steel/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.02s</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
              -8.2% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="verticals">Business Verticals</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-legacore-steel/20">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Request volume and success rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#00BFFF" strokeWidth={2} />
                    <Line type="monotone" dataKey="success" stroke="#D4AF37" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-legacore-steel/20">
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Daily revenue generation across all verticals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verticals" className="space-y-4">
          <div className="grid gap-4">
            {mockVerticalMetrics.map((vertical) => (
              <Card key={vertical.id} className="border-legacore-steel/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-legacore-steel" />
                      {vertical.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(vertical.trend, vertical.trendPercentage)}
                      <span className="text-sm font-medium">{vertical.trendPercentage}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <div className="flex items-center gap-2">
                        <Progress value={vertical.metrics.successRate} className="flex-1" />
                        <span className="text-sm font-medium">{vertical.metrics.successRate}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-lg font-bold text-legacore-gold">
                        ${vertical.metrics.revenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-lg font-bold">{vertical.metrics.activeUsers}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="text-lg font-bold text-green-500">{vertical.metrics.uptime}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {mockAgentMetrics.map((agent) => (
              <Card key={agent.id} className="border-legacore-steel/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                      {agent.name}
                    </CardTitle>
                    <Badge variant="outline">{agent.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-5">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Efficiency</p>
                      <div className="flex items-center gap-2">
                        <Progress value={agent.efficiency} className="flex-1" />
                        <span className="text-sm font-medium">{agent.efficiency}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Satisfaction</p>
                      <p className="text-lg font-bold">{agent.userSatisfaction}/5.0</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Tasks</p>
                      <p className="text-lg font-bold">{agent.metrics.tasksCompleted}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-lg font-bold text-legacore-gold">${agent.metrics.revenue.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Response Time</p>
                      <p className="text-lg font-bold">{agent.metrics.averageResponseTime}ms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-legacore-steel/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-legacore-steel" />
                  Live Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "2 min ago", event: "Atlas completed surplus fund analysis", status: "success" },
                    { time: "5 min ago", event: "Lexis generated credit dispute letter", status: "success" },
                    { time: "8 min ago", event: "Aegis validated debt portfolio", status: "success" },
                    { time: "12 min ago", event: "System health check completed", status: "info" },
                    { time: "15 min ago", event: "New user registered", status: "info" },
                  ].map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.status === "success" ? "bg-green-500" : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm">{activity.event}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-legacore-steel/20">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Real-time system status monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <span className="text-sm font-medium text-green-500">850ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Performance</span>
                    <span className="text-sm font-medium text-green-500">Optimal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Connections</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <span className="text-sm font-medium text-green-500">0.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Uptime</span>
                    <span className="text-sm font-medium text-green-500">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

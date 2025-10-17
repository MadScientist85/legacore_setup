"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Bot,
  Zap,
  TrendingUp,
  Shield,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Settings,
} from "lucide-react"

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-legacore-onyx via-gray-900 to-legacore-onyx p-8 tactical-grid">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-legacore-steel/20 border border-legacore-steel/30">
              <Zap className="h-6 w-6 text-legacore-steel" />
            </div>
            <h1 className="font-bebas text-4xl text-white tracking-wider">LEGACORE™ COMMAND CENTER</h1>
          </div>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl">
            Built to Outlive the Builder. Your legacy automation platform is operational and ready to scale across all
            business verticals.
          </p>
          <div className="flex gap-4">
            <Button className="bg-legacore-steel hover:bg-legacore-steel/80 text-white">
              <Play className="mr-2 h-4 w-4" />
              Deploy Agent
            </Button>
            <Button
              variant="outline"
              className="border-legacore-gold text-legacore-gold hover:bg-legacore-gold/10 bg-transparent"
            >
              <Settings className="mr-2 h-4 w-4" />
              System Config
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-legacore-steel/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-legacore-steel" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-legacore-steel">13</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card className="border-legacore-steel/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-legacore-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-legacore-gold">$45,231</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-legacore-steel/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Automated</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+180 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-legacore-steel/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">99.9%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Agents */}
        <Card className="border-legacore-steel/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-legacore-steel" />
              Active AI Agents
            </CardTitle>
            <CardDescription>Your deployed automation workforce</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Surplus Funds Paralegal", status: "active", tasks: 23 },
              { name: "Credit Repair Writer", status: "active", tasks: 18 },
              { name: "Trust Creation Agent", status: "active", tasks: 12 },
              { name: "GovCon Proposal Bot", status: "idle", tasks: 0 },
              { name: "Digital Product Creator", status: "active", tasks: 31 },
            ].map((agent, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${agent.status === "active" ? "bg-green-500 animate-pulse-steel" : "bg-gray-400"}`}
                  />
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">{agent.tasks} tasks completed</p>
                  </div>
                </div>
                <Badge variant={agent.status === "active" ? "default" : "secondary"}>{agent.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card className="border-legacore-steel/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-legacore-gold" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Real-time system analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>23%</span>
              </div>
              <Progress value={23} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Calls Today</span>
                <span>1,247 / 5,000</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Used</span>
                <span>2.3GB / 100GB</span>
              </div>
              <Progress value={2.3} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-legacore-steel/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest system events and completions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                icon: CheckCircle,
                color: "text-green-500",
                title: "Surplus Funds case completed",
                description: "Generated $2,847 recovery letter for Johnson vs. County",
                time: "2 minutes ago",
              },
              {
                icon: Bot,
                color: "text-legacore-steel",
                title: "Credit Repair Agent deployed",
                description: "New Metro2 dispute letters generated for client portfolio",
                time: "15 minutes ago",
              },
              {
                icon: AlertCircle,
                color: "text-yellow-500",
                title: "API rate limit warning",
                description: "OpenAI usage at 80% of daily limit",
                time: "1 hour ago",
              },
              {
                icon: CheckCircle,
                color: "text-green-500",
                title: "Trust documents finalized",
                description: "Living trust package completed for Williams family",
                time: "2 hours ago",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <activity.icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

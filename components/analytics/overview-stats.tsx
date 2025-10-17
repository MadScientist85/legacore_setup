"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, FileText, MessageSquare } from "lucide-react"

interface OverviewStatsProps {
  data: {
    totalRevenue: number
    activeSubscriptions: number
    totalUsers: number
    totalDocuments: number
    totalMessages: number
  }
}

export function OverviewStats({ data }: OverviewStatsProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Active Subscriptions",
      value: data.activeSubscriptions,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Documents",
      value: data.totalDocuments,
      icon: FileText,
      color: "text-orange-500",
    },
    {
      title: "Messages",
      value: data.totalMessages,
      icon: MessageSquare,
      color: "text-pink-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

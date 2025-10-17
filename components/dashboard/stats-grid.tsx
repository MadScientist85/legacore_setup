import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Zap, TrendingUp, Clock } from "lucide-react"

export function StatsGrid() {
  const stats = [
    {
      title: "Active Agents",
      value: "12",
      change: "+2 from last week",
      icon: Bot,
      color: "text-aurelian-gold",
    },
    {
      title: "Tasks Completed",
      value: "1,247",
      change: "+180 from yesterday",
      icon: Zap,
      color: "text-blue-500",
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1% from last month",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Avg Response Time",
      value: "1.2s",
      change: "-0.3s improvement",
      icon: Clock,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gray-900 border-aurelian-purple/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

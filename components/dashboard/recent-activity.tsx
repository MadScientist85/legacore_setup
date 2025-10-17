import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      title: "Surplus Funds case completed",
      description: "Generated recovery letter for Johnson vs. County",
      time: "2 minutes ago",
      status: "success",
      icon: CheckCircle,
    },
    {
      title: "Credit Repair Agent deployed",
      description: "New Metro2 dispute letters generated",
      time: "15 minutes ago",
      status: "success",
      icon: CheckCircle,
    },
    {
      title: "System maintenance scheduled",
      description: "Scheduled for tonight at 2:00 AM",
      time: "1 hour ago",
      status: "pending",
      icon: Clock,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-500"
      case "pending":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card className="bg-gray-900 border-aurelian-purple/30">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition">
              <activity.icon className={`h-5 w-5 mt-0.5 ${getStatusColor(activity.status)}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">{activity.title}</p>
                <p className="text-sm text-gray-400">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

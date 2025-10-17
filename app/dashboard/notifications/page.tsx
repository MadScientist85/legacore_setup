import type { Metadata } from "next"
import { NotificationCenter } from "@/components/notifications/notification-center"

export const metadata: Metadata = {
  title: "Notifications | LEGACORE",
  description: "Manage your email and SMS notifications",
}

export default function NotificationsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Notification Center</h1>
        <p className="text-muted-foreground">Manage and schedule email and SMS notifications</p>
      </div>

      <NotificationCenter />
    </div>
  )
}

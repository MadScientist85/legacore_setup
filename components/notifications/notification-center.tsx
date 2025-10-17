"use client"

import { useState, useEffect } from "react"
import { Bell, Mail, MessageSquare, Clock, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
  id: string
  type: string
  channel: string
  scheduled_for: string
  status: string
  data: any
  created_at: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/notifications/schedule")
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const cancelNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/schedule?id=${id}`, { method: "DELETE" })
      setNotifications(notifications.filter((n) => n.id !== id))
    } catch (error) {
      console.error("Error canceling notification:", error)
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="w-4 h-4" />
      case "sms":
        return <MessageSquare className="w-4 h-4" />
      case "both":
        return <Bell className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      pending: "secondary",
      sent: "default",
      failed: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const pendingNotifications = notifications.filter((n) => n.status === "pending")
  const sentNotifications = notifications.filter((n) => n.status === "sent")
  const failedNotifications = notifications.filter((n) => n.status === "failed")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending <Badge className="ml-2">{pendingNotifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent <Badge className="ml-2">{sentNotifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed{" "}
              <Badge className="ml-2" variant="destructive">
                {failedNotifications.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <ScrollArea className="h-[400px]">
              {pendingNotifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pending notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingNotifications.map((notification) => (
                    <Card key={notification.id} className="border-l-4 border-l-yellow-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-yellow-100 rounded-lg">{getChannelIcon(notification.channel)}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold capitalize">{notification.type.replace("_", " ")}</h4>
                                {getStatusBadge(notification.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Scheduled for: {new Date(notification.scheduled_for).toLocaleString()}
                              </p>
                              <div className="text-xs text-muted-foreground">
                                Channel: <span className="capitalize">{notification.channel}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelNotification(notification.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="sent">
            <ScrollArea className="h-[400px]">
              {sentNotifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Check className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No sent notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sentNotifications.map((notification) => (
                    <Card key={notification.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">{getChannelIcon(notification.channel)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold capitalize">{notification.type.replace("_", " ")}</h4>
                              {getStatusBadge(notification.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Sent: {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="failed">
            <ScrollArea className="h-[400px]">
              {failedNotifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Check className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No failed notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {failedNotifications.map((notification) => (
                    <Card key={notification.id} className="border-l-4 border-l-red-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">{getChannelIcon(notification.channel)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold capitalize">{notification.type.replace("_", " ")}</h4>
                              {getStatusBadge(notification.status)}
                            </div>
                            <p className="text-sm text-red-600">Failed to send</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

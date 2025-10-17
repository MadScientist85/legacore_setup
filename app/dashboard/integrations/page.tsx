"use client"

import { useState, useEffect } from "react"
import { Cloud, MessageSquare, Zap } from "lucide-react"
import { IntegrationCard } from "@/components/integrations/integration-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Integration {
  provider: string
  active: boolean
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    try {
      const response = await fetch("/api/integrations/list")
      const data = await response.json()
      setIntegrations(data.integrations || [])
    } catch (error) {
      console.error("Error loading integrations:", error)
    } finally {
      setLoading(false)
    }
  }

  const isConnected = (provider: string) => {
    return integrations.some((i) => i.provider === provider && i.active)
  }

  const handleGoogleDriveConnect = async () => {
    try {
      const response = await fetch("/api/integrations/google-drive/auth")
      const data = await response.json()
      window.location.href = data.authUrl
    } catch (error) {
      console.error("Error connecting Google Drive:", error)
    }
  }

  const handleSlackConnect = async () => {
    const token = prompt("Enter your Slack Bot Token:")
    if (!token) return

    try {
      await fetch("/api/integrations/slack/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      loadIntegrations()
    } catch (error) {
      console.error("Error connecting Slack:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect LEGACORE with your favorite tools</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IntegrationCard
          name="Google Drive"
          description="Store and sync documents with Google Drive"
          icon={<Cloud className="w-6 h-6 text-blue-500" />}
          connected={isConnected("google_drive")}
          onConnect={handleGoogleDriveConnect}
        />

        <IntegrationCard
          name="Slack"
          description="Send notifications and updates to Slack channels"
          icon={<MessageSquare className="w-6 h-6 text-purple-500" />}
          connected={isConnected("slack")}
          onConnect={handleSlackConnect}
        />

        <IntegrationCard
          name="Zapier"
          description="Automate workflows with thousands of apps"
          icon={<Zap className="w-6 h-6 text-orange-500" />}
          connected={isConnected("zapier")}
          onConnect={() => alert("Zapier integration coming soon!")}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>Use LEGACORE API to build custom integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View API documentation at{" "}
            <a href="/docs/api" className="text-blue-500 hover:underline">
              /docs/api
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

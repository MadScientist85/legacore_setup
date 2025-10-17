"use client"

import type React from "react"

import { useState } from "react"
import { Check, Settings, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface IntegrationCardProps {
  name: string
  description: string
  icon: React.ReactNode
  connected: boolean
  onConnect: () => void
  onDisconnect?: () => void
  onConfigure?: () => void
}

export function IntegrationCard({
  name,
  description,
  icon,
  connected,
  onConnect,
  onDisconnect,
  onConfigure,
}: IntegrationCardProps) {
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    setLoading(true)
    try {
      await onConnect()
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (onDisconnect) {
      setLoading(true)
      try {
        await onDisconnect()
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Card className={connected ? "border-green-500" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {name}
                {connected && (
                  <Badge variant="default" className="bg-green-500">
                    <Check className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {!connected ? (
            <Button onClick={handleConnect} disabled={loading} className="flex-1">
              {loading ? "Connecting..." : "Connect"}
            </Button>
          ) : (
            <>
              {onConfigure && (
                <Button variant="outline" onClick={onConfigure} className="flex-1 bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              )}
              {onDisconnect && (
                <Button variant="destructive" onClick={handleDisconnect} disabled={loading} className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

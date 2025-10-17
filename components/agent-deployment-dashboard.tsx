"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Play } from "lucide-react"

interface Agent {
  id: string
  name: string
  category: string
  description: string
  status: "active" | "paused" | "stopped"
  deployments: number
  performance: number
  revenue: number
  interactions: number
}

interface Deployment {
  id: string
  name: string
  agent: string
  status: "active" | "paused" | "stopped" | "error"
  environment: "development" | "staging" | "production"
  uptime: number
  requests: number
  errors: number
  lastActivity: string
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Atlas - Surplus Funds Paralegal",
    category: "legal",
    description: "Post-foreclosure surplus recovery specialist",
    status: "active",
    deployments: 3,
    performance: 94,
    revenue: 45231,
    interactions: 1247,
  },
  {
    id: "2",
    name: "Lexis - Credit Repair Agent",
    category: "credit",
    description: "Metro2 + FCRA credit disputing expert",
    status: "active",
    deployments: 2,
    performance: 89,
    revenue: 32150,
    interactions: 892,
  },
  {
    id: "3",
    name: "Aegis - Debt Buyer Agent",
    category: "debt",
    description: "Debt validation and furnishing automation",
    status: "paused",
    deployments: 1,
    performance: 76,
    revenue: 18900,
    interactions: 456,
  },
]

const mockDeployments: Deployment[] = [
  {
    id: "1",
    name: "Atlas Production",
    agent: "Atlas - Surplus Funds Paralegal",
    status: "active",
    environment: "production",
    uptime: 99.8,
    requests: 15420,
    errors: 12,
    lastActivity: "2 minutes ago",
  },
  {
    id: "2",
    name: "Lexis Staging",
    agent: "Lexis - Credit Repair Agent",
    status: "active",
    environment: "staging",
    uptime: 98.5,
    requests: 8930,
    errors: 45,
    lastActivity: "5 minutes ago",
  },
]

export function AgentDeploymentDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [deploymentDialogOpen, setDeploymentDialogOpen] = useState(false)
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [deployments, setDeployments] = useState<Deployment[]>(mockDeployments)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "stopped":
        return "bg-red-500"
      case "error":
        return "bg-red-600"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "paused":
        return "secondary"
      case "stopped":
        return "destructive"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bebas tracking-wider text-legacore-steel">AGENT DEPLOYMENT CENTER</h1>
          <p className="text-muted-foreground">Deploy, monitor, and manage your AI agent workforce</p>
        </div>
        <Dialog open={deploymentDialogOpen} onOpenChange={setDeploymentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-legacore-steel hover:bg-legacore-steel/80">
              <Play className="mr-2 h-4 w-4" />
              Deploy Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Deploy New Agent</DialogTitle>
              <DialogDescription>Configure and deploy an AI agent to your infrastructure</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="agent-select" className="text-right">
                  Agent
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deployment-name" className="text-right">
                  Name
                </Label>
                <Input id="deployment-name" placeholder="Production Deployment" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="environment" className="text-right">
                  Environment
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rate-limit" className="text-right">
                  Rate Limit
                </Label>
                <Input id="rate-limit" placeholder="100/hour" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="auto-scale" className="text-right">
                  Auto Scale
                </Label>
                <Switch id="auto-scale" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-legacore-steel hover:bg-legacore-steel/80">
                Deploy Agent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

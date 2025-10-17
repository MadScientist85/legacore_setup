"use client"

import { Brain, Lightbulb, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ThinkingStep {
  id: string
  type: "analysis" | "reasoning" | "conclusion" | "warning"
  content: string
  timestamp: Date
}

interface ThinkingDisplayProps {
  steps: ThinkingStep[]
  isActive?: boolean
  className?: string
}

export function ThinkingDisplay({ steps, isActive = false, className }: ThinkingDisplayProps) {
  if (steps.length === 0 && !isActive) return null

  const getIcon = (type: ThinkingStep["type"]) => {
    switch (type) {
      case "analysis":
        return <Brain className="w-4 h-4" />
      case "reasoning":
        return <Lightbulb className="w-4 h-4" />
      case "conclusion":
        return <Brain className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getTypeColor = (type: ThinkingStep["type"]) => {
    switch (type) {
      case "analysis":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "reasoning":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "conclusion":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    }
  }

  return (
    <Card className={cn("border-dashed", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className={cn("w-4 h-4", isActive && "animate-pulse text-blue-500")} />
          {isActive ? "Thinking..." : "Reasoning Process"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex gap-3 items-start">
            <div className={cn("p-2 rounded-lg", getTypeColor(step.type))}>{getIcon(step.type)}</div>
            <div className="flex-1 space-y-1">
              <Badge variant="outline" className="text-xs">
                {step.type}
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.content}</p>
            </div>
          </div>
        ))}
        {isActive && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            Processing...
          </div>
        )}
      </CardContent>
    </Card>
  )
}

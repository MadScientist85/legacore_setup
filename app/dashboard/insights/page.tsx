import type { Metadata } from "next"
import { InsightsDashboard } from "@/components/insights/insights-dashboard"

export const metadata: Metadata = {
  title: "AI Insights | LEGACORE",
  description: "AI-powered business insights and predictions",
}

export default function InsightsPage() {
  return (
    <div className="container mx-auto p-6">
      <InsightsDashboard />
    </div>
  )
}

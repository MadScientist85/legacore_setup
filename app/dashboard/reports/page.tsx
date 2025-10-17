import type { Metadata } from "next"
import { MetricsDashboard } from "@/components/analytics/metrics-dashboard"
import { ReportGenerator } from "@/components/analytics/report-generator"
import { ReportList } from "@/components/analytics/report-list"

export const metadata: Metadata = {
  title: "Reports | LEGACORE",
  description: "Generate and manage analytics reports",
}

export default function ReportsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
        <p className="text-muted-foreground">Track metrics and generate comprehensive reports</p>
      </div>

      <MetricsDashboard />

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportGenerator />
        <ReportList />
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DocumentStatsProps {
  data: Record<string, { count: number; size: number }>
  totalStorage: number
}

export function DocumentStats({ data, totalStorage }: DocumentStatsProps) {
  const chartData = Object.entries(data).map(([category, stats]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count: stats.count,
    size: (stats.size / 1024 / 1024).toFixed(2), // Convert to MB
  }))

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Statistics</CardTitle>
        <CardDescription>Total storage: {formatBytes(totalStorage)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

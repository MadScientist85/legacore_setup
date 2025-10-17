import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

interface InsightData {
  revenue: number[]
  users: number[]
  documents: number[]
  agentExecutions: number[]
  labels: string[]
}

export async function generateBusinessInsights(data: InsightData): Promise<string> {
  const prompt = `You are a business analytics expert. Analyze the following data and provide actionable insights:

Revenue trend: ${data.revenue.join(", ")}
User growth: ${data.users.join(", ")}
Documents processed: ${data.documents.join(", ")}
Agent executions: ${data.agentExecutions.join(", ")}
Time periods: ${data.labels.join(", ")}

Provide:
1. Key trends and patterns
2. Growth predictions for next 30 days
3. Risk indicators
4. Actionable recommendations
5. Opportunities for improvement

Format as clear, concise bullet points.`

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
  })

  return text
}

export async function predictRevenue(historicalRevenue: number[]): Promise<{
  predictions: number[]
  confidence: number
  trend: "up" | "down" | "stable"
}> {
  if (historicalRevenue.length < 7) {
    return {
      predictions: [],
      confidence: 0,
      trend: "stable",
    }
  }

  // Calculate trend
  const recent = historicalRevenue.slice(-7)
  const average = recent.reduce((a, b) => a + b, 0) / recent.length
  const previous = historicalRevenue.slice(-14, -7)
  const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length

  const growthRate = (average - previousAvg) / previousAvg
  const trend = growthRate > 0.05 ? "up" : growthRate < -0.05 ? "down" : "stable"

  // Simple linear prediction for next 7 days
  const predictions: number[] = []
  for (let i = 1; i <= 7; i++) {
    const predicted = average * (1 + growthRate * (i / 7))
    predictions.push(Math.max(0, predicted))
  }

  // Calculate confidence based on data consistency
  const variance = recent.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / recent.length
  const stdDev = Math.sqrt(variance)
  const confidence = Math.max(0, Math.min(100, 100 - (stdDev / average) * 50))

  return { predictions, confidence, trend }
}

export async function detectAnomalies(data: number[]): Promise<{
  anomalies: number[]
  threshold: number
  severity: "low" | "medium" | "high"
}> {
  if (data.length < 7) {
    return { anomalies: [], threshold: 0, severity: "low" }
  }

  // Calculate mean and standard deviation
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
  const stdDev = Math.sqrt(variance)

  // Threshold: 2 standard deviations
  const threshold = mean + 2 * stdDev
  const anomalies = data.map((val, idx) => (Math.abs(val - mean) > 2 * stdDev ? idx : -1)).filter((idx) => idx !== -1)

  const severity =
    anomalies.length > data.length * 0.2 ? "high" : anomalies.length > data.length * 0.1 ? "medium" : "low"

  return { anomalies, threshold, severity }
}

export async function generateUserSegmentation(
  users: {
    id: string
    activity_score: number
    revenue_contribution: number
    last_active: string
  }[],
): Promise<{
  segments: {
    name: string
    count: number
    characteristics: string[]
    recommendations: string[]
  }[]
}> {
  const highValue = users.filter((u) => u.revenue_contribution > 200 && u.activity_score > 70)
  const atRisk = users.filter(
    (u) =>
      u.revenue_contribution > 100 &&
      new Date().getTime() - new Date(u.last_active).getTime() > 14 * 24 * 60 * 60 * 1000,
  )
  const newUsers = users.filter(
    (u) => new Date().getTime() - new Date(u.last_active).getTime() < 7 * 24 * 60 * 60 * 1000,
  )
  const dormant = users.filter(
    (u) => new Date().getTime() - new Date(u.last_active).getTime() > 30 * 24 * 60 * 60 * 1000,
  )

  return {
    segments: [
      {
        name: "High-Value Active",
        count: highValue.length,
        characteristics: ["High revenue contribution", "Frequent engagement", "Power users"],
        recommendations: [
          "Offer premium features",
          "Request testimonials",
          "Invite to beta programs",
          "Provide priority support",
        ],
      },
      {
        name: "At-Risk",
        count: atRisk.length,
        characteristics: ["Previously active", "Recent decline in usage", "Revenue contributors"],
        recommendations: [
          "Send re-engagement email",
          "Offer special discount",
          "Request feedback survey",
          "Provide personalized support",
        ],
      },
      {
        name: "New Users",
        count: newUsers.length,
        characteristics: ["Recently joined", "Learning the platform", "High potential"],
        recommendations: [
          "Send onboarding emails",
          "Offer tutorial sessions",
          "Provide quick-start guide",
          "Monitor initial experience",
        ],
      },
      {
        name: "Dormant",
        count: dormant.length,
        characteristics: ["Inactive for 30+ days", "Low engagement", "Churn risk"],
        recommendations: [
          "Win-back campaign",
          "Survey for churn reasons",
          "Offer re-activation incentive",
          "Consider removal from active list",
        ],
      },
    ],
  }
}

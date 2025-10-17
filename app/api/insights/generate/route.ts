import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateBusinessInsights, predictRevenue, detectAnomalies } from "@/lib/ai/insights-engine"
import { supabaseAdmin } from "@/lib/supabase/client"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { type, timeRange = 30 } = body

    // Fetch revenue data
    const { data: payments } = await supabaseAdmin
      .from("payment_history")
      .select("amount, created_at")
      .gte("created_at", new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: true })

    // Fetch user data
    const { data: users } = await supabaseAdmin
      .from("users")
      .select("created_at")
      .gte("created_at", new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: true })

    // Fetch document data
    const { data: documents } = await supabaseAdmin
      .from("documents")
      .select("created_at")
      .gte("created_at", new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: true })

    // Fetch conversation data (agent executions)
    const { data: conversations } = await supabaseAdmin
      .from("conversations")
      .select("created_at")
      .gte("created_at", new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: true })

    // Aggregate data by day
    const aggregateByDay = (data: any[], valueKey = "amount") => {
      const dayMap = new Map<string, number>()

      data?.forEach((item) => {
        const day = new Date(item.created_at).toISOString().split("T")[0]
        const value = valueKey === "amount" ? item.amount || 0 : 1
        dayMap.set(day, (dayMap.get(day) || 0) + value)
      })

      return dayMap
    }

    const revenueByday = aggregateByDay(payments || [], "amount")
    const usersByDay = aggregateByDay(users || [], "count")
    const docsByDay = aggregateByDay(documents || [], "count")
    const agentsByDay = aggregateByDay(conversations || [], "count")

    // Create arrays for all days in range
    const days: string[] = []
    for (let i = timeRange - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      days.push(date.toISOString().split("T")[0])
    }

    const revenue = days.map((day) => revenueByday.get(day) || 0)
    const usersCount = days.map((day) => usersByDay.get(day) || 0)
    const docsCount = days.map((day) => docsByDay.get(day) || 0)
    const agentsCount = days.map((day) => agentsByDay.get(day) || 0)

    const insights: any = {}

    switch (type) {
      case "overview":
        const businessInsights = await generateBusinessInsights({
          revenue,
          users: usersCount,
          documents: docsCount,
          agentExecutions: agentsCount,
          labels: days,
        })
        insights.business = businessInsights
        break

      case "predictions":
        const revenuePrediction = await predictRevenue(revenue)
        insights.revenue = revenuePrediction
        break

      case "anomalies":
        const revenueAnomalies = await detectAnomalies(revenue)
        const userAnomalies = await detectAnomalies(usersCount)
        insights.anomalies = {
          revenue: revenueAnomalies,
          users: userAnomalies,
        }
        break

      default:
        return NextResponse.json({ error: "Invalid insight type" }, { status: 400 })
    }

    // Save insight to database
    await supabaseAdmin.from("insights").insert({
      user_id: session.user.id,
      type,
      data: insights,
      generated_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, insights })
  } catch (error) {
    console.error("Generate insights error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

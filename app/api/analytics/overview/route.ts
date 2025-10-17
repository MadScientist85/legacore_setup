import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user
    const { data: user } = await supabase.from("users").select("id, role").eq("email", session.user.email).single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Only admins can view analytics
    if (user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get total revenue
    const { data: payments } = await supabase.from("payment_history").select("amount").eq("status", "succeeded")

    const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0

    // Get active subscriptions
    const { data: subscriptions, count: activeSubscriptions } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact" })
      .eq("status", "active")

    // Get total users
    const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact" })

    // Get total documents
    const { count: totalDocuments } = await supabase.from("documents").select("*", { count: "exact" })

    // Get chat messages count
    const { count: totalMessages } = await supabase.from("conversations").select("*", { count: "exact" })

    // Get revenue by day (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: revenueByDay } = await supabase
      .from("payment_history")
      .select("amount, created_at")
      .eq("status", "succeeded")
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true })

    // Group by day
    const revenueData = revenueByDay?.reduce(
      (acc, payment) => {
        const date = new Date(payment.created_at).toLocaleDateString()
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += payment.amount / 100
        return acc
      },
      {} as Record<string, number>,
    )

    const chartData = Object.entries(revenueData || {}).map(([date, revenue]) => ({
      date,
      revenue,
    }))

    // Get subscription breakdown
    const subscriptionBreakdown = subscriptions?.reduce(
      (acc, sub) => {
        if (!acc[sub.plan]) {
          acc[sub.plan] = 0
        }
        acc[sub.plan]++
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      overview: {
        totalRevenue: totalRevenue / 100,
        activeSubscriptions: activeSubscriptions || 0,
        totalUsers: totalUsers || 0,
        totalDocuments: totalDocuments || 0,
        totalMessages: totalMessages || 0,
      },
      revenueChart: chartData,
      subscriptionBreakdown,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

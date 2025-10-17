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

    const { data: user } = await supabase.from("users").select("id, role").eq("email", session.user.email).single()

    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get user growth data (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: users } = await supabase
      .from("users")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true })

    // Group by day
    const usersByDay = users?.reduce(
      (acc, user) => {
        const date = new Date(user.created_at).toLocaleDateString()
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date]++
        return acc
      },
      {} as Record<string, number>,
    )

    const chartData = Object.entries(usersByDay || {}).map(([date, users]) => ({
      date,
      users,
    }))

    // Get users by role
    const { data: allUsers } = await supabase.from("users").select("role")

    const roleBreakdown = allUsers?.reduce(
      (acc, user) => {
        if (!acc[user.role]) {
          acc[user.role] = 0
        }
        acc[user.role]++
        return acc
      },
      {} as Record<string, number>,
    )

    // Get active users (logged in last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: activeUsers } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .gte("last_login", sevenDaysAgo.toISOString())

    return NextResponse.json({
      userGrowth: chartData,
      roleBreakdown,
      activeUsers: activeUsers || 0,
    })
  } catch (error) {
    console.error("User analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

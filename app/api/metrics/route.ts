import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Gather system metrics
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      activeUsers,
      totalDocuments,
      recentDocuments,
      totalConversations,
      recentConversations,
      errorCount,
    ] = await Promise.all([
      supabase.from("users").select("id", { count: "exact" }),
      supabase.from("users").select("id", { count: "exact" }).gte("last_login", oneDayAgo.toISOString()),
      supabase.from("documents").select("id", { count: "exact" }),
      supabase.from("documents").select("id", { count: "exact" }).gte("created_at", oneDayAgo.toISOString()),
      supabase.from("conversations").select("id", { count: "exact" }),
      supabase.from("conversations").select("id", { count: "exact" }).gte("created_at", oneDayAgo.toISOString()),
      supabase.from("error_logs").select("id", { count: "exact" }).gte("created_at", oneDayAgo.toISOString()),
    ])

    const metrics = {
      timestamp: now.toISOString(),
      users: {
        total: totalUsers.count || 0,
        active_24h: activeUsers.count || 0,
      },
      documents: {
        total: totalDocuments.count || 0,
        uploaded_24h: recentDocuments.count || 0,
      },
      conversations: {
        total: totalConversations.count || 0,
        started_24h: recentConversations.count || 0,
      },
      errors: {
        count_24h: errorCount.count || 0,
      },
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Metrics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

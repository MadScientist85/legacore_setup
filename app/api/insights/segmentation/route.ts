import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateUserSegmentation } from "@/lib/ai/insights-engine"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all users with their activity data
    const { data: users } = await supabase.from("users").select(`
        id,
        last_login,
        created_at
      `)

    if (!users) {
      return NextResponse.json({ error: "No users found" }, { status: 404 })
    }

    // Calculate activity scores and revenue for each user
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        // Get user's payment history
        const { data: payments } = await supabase.from("payment_history").select("amount").eq("user_id", user.id)

        const revenueContribution = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

        // Get user's activity (documents + conversations)
        const { count: docCount } = await supabase
          .from("documents")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        const { count: convCount } = await supabase
          .from("conversations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        const activityScore = Math.min(100, ((docCount || 0) + (convCount || 0)) * 5)

        return {
          id: user.id,
          activity_score: activityScore,
          revenue_contribution: revenueContribution,
          last_active: user.last_login || user.created_at,
        }
      }),
    )

    const segmentation = await generateUserSegmentation(enrichedUsers)

    return NextResponse.json({ success: true, segmentation })
  } catch (error) {
    console.error("User segmentation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

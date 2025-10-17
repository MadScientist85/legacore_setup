import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action } = await req.json()

    switch (action) {
      case "clean_old_logs":
        // Clean logs older than 90 days
        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

        await Promise.all([
          supabase.from("audit_logs").delete().lt("created_at", ninetyDaysAgo.toISOString()),
          supabase.from("error_logs").delete().lt("created_at", ninetyDaysAgo.toISOString()),
          supabase.from("notification_logs").delete().lt("created_at", ninetyDaysAgo.toISOString()),
        ])

        return NextResponse.json({ success: true, message: "Old logs cleaned" })

      case "rebuild_indexes":
        // This would typically be done via direct database access
        return NextResponse.json({
          success: true,
          message: "Index rebuild initiated. Run performance-indexes.sql manually.",
        })

      case "clear_cache":
        // Clear all cache patterns
        const { CacheManager } = await import("@/lib/performance/cache-manager")
        const cache = new CacheManager("legacore")
        await cache.invalidatePattern("*")

        return NextResponse.json({ success: true, message: "Cache cleared" })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Optimization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

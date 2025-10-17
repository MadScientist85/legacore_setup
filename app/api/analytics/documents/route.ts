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

    // Get documents by category
    const { data: documents } = await supabase.from("documents").select("category, file_size")

    const categoryBreakdown = documents?.reduce(
      (acc, doc) => {
        if (!acc[doc.category]) {
          acc[doc.category] = { count: 0, size: 0 }
        }
        acc[doc.category].count++
        acc[doc.category].size += doc.file_size || 0
        return acc
      },
      {} as Record<string, { count: number; size: number }>,
    )

    // Get document upload trend (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: recentDocs } = await supabase
      .from("documents")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true })

    const docsByDay = recentDocs?.reduce(
      (acc, doc) => {
        const date = new Date(doc.created_at).toLocaleDateString()
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date]++
        return acc
      },
      {} as Record<string, number>,
    )

    const uploadTrend = Object.entries(docsByDay || {}).map(([date, count]) => ({
      date,
      count,
    }))

    // Get total storage used
    const totalStorage = documents?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0

    return NextResponse.json({
      categoryBreakdown,
      uploadTrend,
      totalStorage,
      totalDocuments: documents?.length || 0,
    })
  } catch (error) {
    console.error("Document analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

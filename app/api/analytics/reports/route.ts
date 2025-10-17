import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase/client"
import { generateReport } from "@/lib/analytics/metrics-calculator"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: reports, error } = await supabaseAdmin
      .from("reports")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("List reports error:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { startDate, endDate, format = "json", name } = body

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start and end dates required" }, { status: 400 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    const reportData = await generateReport(start, end, format)

    const { data: report, error } = await supabaseAdmin
      .from("reports")
      .insert({
        user_id: session.user.id,
        name: name || `Report ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        format,
        data: reportData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ report })
  } catch (error) {
    console.error("Create report error:", error)
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}

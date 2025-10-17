import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let query = supabaseAdmin
      .from("insights")
      .select("*")
      .eq("user_id", session.user.id)
      .order("generated_at", { ascending: false })
      .limit(limit)

    if (type) {
      query = query.eq("type", type)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ insights: data })
  } catch (error) {
    console.error("List insights error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

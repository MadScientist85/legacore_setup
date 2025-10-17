import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get("agentId")
    const companyId = searchParams.get("companyId")

    if (!agentId || !companyId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Get the most recent conversation for this agent and user
    const { data: conversation, error } = await supabaseAdmin
      .from("conversations")
      .select("*")
      .eq("agent_id", agentId)
      .eq("company_id", companyId)
      .eq("user_id", session.user.email)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      throw error
    }

    return NextResponse.json({
      conversation: conversation || null,
    })
  } catch (error) {
    console.error("Error fetching conversation history:", error)
    return NextResponse.json({ error: "Failed to fetch conversation history" }, { status: 500 })
  }
}

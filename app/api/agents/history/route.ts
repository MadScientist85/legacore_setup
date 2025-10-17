import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase/client"
import { getAgentById } from "@/lib/agents/registry"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Get user ID
    const { data: user } = await supabaseAdmin.from("users").select("id").eq("email", session.user.email).single()

    const userId = user?.id || session.user.email

    // Fetch agent run history
    const { data: runs, error } = await supabaseAdmin
      .from("agent_runs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    // Enrich with agent names
    const enrichedRuns = runs.map((run) => {
      const agent = getAgentById(run.agent_id)
      return {
        ...run,
        agentName: agent?.name || "Unknown Agent",
      }
    })

    return NextResponse.json({ runs: enrichedRuns })
  } catch (error) {
    console.error("Failed to fetch agent history:", error)
    return NextResponse.json({ error: "Failed to fetch agent history" }, { status: 500 })
  }
}

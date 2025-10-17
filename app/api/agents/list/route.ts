import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getActiveAgents } from "@/lib/agents/registry"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agents = getActiveAgents()

    return NextResponse.json({ agents })
  } catch (error) {
    console.error("Failed to list agents:", error)
    return NextResponse.json({ error: "Failed to list agents" }, { status: 500 })
  }
}

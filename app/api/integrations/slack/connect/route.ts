import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { token, channel } = body

    if (!token) {
      return NextResponse.json({ error: "Slack token required" }, { status: 400 })
    }

    await supabase.from("integrations").upsert({
      user_id: session.user.id,
      provider: "slack",
      access_token: token,
      config: { default_channel: channel },
      active: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Slack connect error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: webhooks, error } = await supabase
      .from("zapier_webhooks")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ webhooks })
  } catch (error) {
    console.error("Fetch webhooks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { url, event, active = true } = body

    if (!url || !event) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: webhook, error } = await supabase
      .from("zapier_webhooks")
      .insert({
        user_id: session.user.id,
        url,
        event,
        active,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, webhook })
  } catch (error) {
    console.error("Create webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Webhook ID required" }, { status: 400 })
    }

    const { error } = await supabase.from("zapier_webhooks").delete().eq("id", id).eq("user_id", session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

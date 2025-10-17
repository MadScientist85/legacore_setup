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
    const { userId, type, channel, data, scheduledFor } = body

    if (!userId || !type || !channel || !scheduledFor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: scheduled, error } = await supabase
      .from("scheduled_notifications")
      .insert({
        user_id: userId,
        type,
        channel,
        data,
        scheduled_for: scheduledFor,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, notification: scheduled })
  } catch (error) {
    console.error("Schedule notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    let query = supabase.from("scheduled_notifications").select("*").order("scheduled_for", { ascending: true })

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ notifications: data })
  } catch (error) {
    console.error("Fetch scheduled notifications error:", error)
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
      return NextResponse.json({ error: "Missing notification ID" }, { status: 400 })
    }

    const { error } = await supabase.from("scheduled_notifications").delete().eq("id", id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete scheduled notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

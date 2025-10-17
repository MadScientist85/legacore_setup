import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch or create user in database
    let { data: user, error } = await supabaseAdmin.from("users").select("*").eq("email", session.user.email).single()

    // If user doesn't exist, create them
    if (error && error.code === "PGRST116") {
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("users")
        .insert({
          email: session.user.email,
          name: session.user.name || null,
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      user = newUser
    } else if (error) {
      throw error
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("User fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

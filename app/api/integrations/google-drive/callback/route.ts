import { type NextRequest, NextResponse } from "next/server"
import { createGoogleDriveClient } from "@/lib/integrations/google-drive"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code || !state) {
      return NextResponse.redirect(new URL("/dashboard?error=invalid_callback", req.url))
    }

    const { userId } = JSON.parse(state)
    const googleDrive = createGoogleDriveClient()
    const tokens = await googleDrive.getToken(code)

    await supabase.from("integrations").upsert({
      user_id: userId,
      provider: "google_drive",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expiry_date).toISOString(),
      active: true,
    })

    return NextResponse.redirect(new URL("/dashboard/integrations?success=google_drive", req.url))
  } catch (error) {
    console.error("Google Drive callback error:", error)
    return NextResponse.redirect(new URL("/dashboard?error=integration_failed", req.url))
  }
}

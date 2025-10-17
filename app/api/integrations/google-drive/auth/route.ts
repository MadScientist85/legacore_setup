import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createGoogleDriveClient } from "@/lib/integrations/google-drive"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const googleDrive = createGoogleDriveClient()
    const state = JSON.stringify({ userId: session.user.id })
    const authUrl = googleDrive.getAuthUrl(state)

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error("Google Drive auth error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

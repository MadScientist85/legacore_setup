import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { videoGenerator } from "@/lib/ai/video-generator"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { prompt, imageUrl, duration = 3 } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const video = imageUrl
      ? await videoGenerator.imageToVideo(imageUrl, prompt, duration)
      : await videoGenerator.textToVideo(prompt, duration)

    return NextResponse.json({
      success: true,
      video,
    })
  } catch (error) {
    console.error("Video generation error:", error)
    return NextResponse.json({ error: "Video generation failed" }, { status: 500 })
  }
}

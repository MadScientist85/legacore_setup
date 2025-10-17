import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { imageGenerator } from "@/lib/ai/image-generator"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { prompt, numImages = 1, width = 1024, height = 1024, enhance = false } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const finalPrompt = enhance ? await imageGenerator.enhancePrompt(prompt) : prompt

    const images = await imageGenerator.generateImage({
      prompt: finalPrompt,
      numImages,
      width,
      height,
    })

    return NextResponse.json({
      success: true,
      images,
      enhancedPrompt: enhance ? finalPrompt : undefined,
    })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 })
  }
}

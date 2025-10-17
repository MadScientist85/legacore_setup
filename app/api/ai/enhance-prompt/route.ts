import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { promptEnhancer } from "@/lib/ai/prompt-enhancer"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { prompt, context } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const enhanced = await promptEnhancer.enhancePrompt(prompt, context)
    const analysis = await promptEnhancer.analyzePrompt(prompt)

    return NextResponse.json({
      success: true,
      original: prompt,
      enhanced,
      analysis,
    })
  } catch (error) {
    console.error("Prompt enhancement error:", error)
    return NextResponse.json({ error: "Prompt enhancement failed" }, { status: 500 })
  }
}

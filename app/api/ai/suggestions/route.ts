import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateText } from "@/lib/ai/openai-client"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { text } = body

    if (!text || text.length < 3) {
      return NextResponse.json({ suggestions: [] })
    }

    const systemPrompt = `You are a helpful writing assistant. Provide 3 relevant suggestions to complete or improve the user's text.
Return a JSON array of objects with: id, text, type (completion/correction/enhancement), score (0-100).
Keep suggestions concise and relevant.`

    const userPrompt = `Text: "${text}"\n\nProvide suggestions:`

    const response = await generateText(userPrompt, "gpt-4o", systemPrompt)
    const suggestions = JSON.parse(response)

    return NextResponse.json({
      success: true,
      suggestions: Array.isArray(suggestions) ? suggestions : [],
    })
  } catch (error) {
    console.error("Suggestions error:", error)
    return NextResponse.json({ suggestions: [] })
  }
}

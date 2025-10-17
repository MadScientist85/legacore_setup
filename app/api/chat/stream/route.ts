import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase/client"
import { streamText } from "@/lib/ai/openai-client"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { agentId, companyId, conversationId, message, attachments } = await req.json()

    // Get agent configuration
    const { data: agent, error: agentError } = await supabaseAdmin.from("agents").select("*").eq("id", agentId).single()

    if (agentError || !agent) {
      return new Response("Agent not found", { status: 404 })
    }

    // Get or create conversation
    let currentConversationId = conversationId

    if (!currentConversationId) {
      const { data: newConversation, error: convError } = await supabaseAdmin
        .from("conversations")
        .insert({
          agent_id: agentId,
          company_id: companyId,
          user_id: session.user.email,
          title: message.substring(0, 50) + "...",
          messages: [],
        })
        .select()
        .single()

      if (convError) {
        throw new Error("Failed to create conversation")
      }

      currentConversationId = newConversation.id
    }

    // Prepare system prompt with agent instructions
    const systemPrompt = agent.instructions || `You are ${agent.name}. ${agent.description}`

    // Create a readable stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = ""

          // Stream the AI response
          await streamText(message, agent.model, systemPrompt, (chunk) => {
            fullResponse += chunk
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "content", content: chunk })}\n\n`))
          })

          // Save the conversation to database
          const { data: conversation } = await supabaseAdmin
            .from("conversations")
            .select("messages")
            .eq("id", currentConversationId)
            .single()

          const existingMessages = conversation?.messages || []
          const newMessages = [
            ...existingMessages,
            {
              id: Date.now().toString(),
              role: "user",
              content: message,
              timestamp: new Date().toISOString(),
              attachments,
            },
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: fullResponse,
              timestamp: new Date().toISOString(),
            },
          ]

          await supabaseAdmin
            .from("conversations")
            .update({
              messages: newMessages,
              updated_at: new Date().toISOString(),
            })
            .eq("id", currentConversationId)

          // Send completion message
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "done",
                conversationId: currentConversationId,
              })}\n\n`,
            ),
          )

          controller.close()
        } catch (error) {
          console.error("Stream error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat stream error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}

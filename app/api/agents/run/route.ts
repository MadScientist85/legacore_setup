import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAgentById } from "@/lib/agents/registry"
import { runAgentPrompt } from "@/lib/ai/openai-client"
import { supabaseAdmin } from "@/lib/supabase/client"
import { sendAgentNotification } from "@/lib/integrations/twilio"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { agentId, input, notifyViaSMS } = await req.json()

    if (!agentId || !input) {
      return NextResponse.json({ error: "Missing required fields: agentId and input" }, { status: 400 })
    }

    const agent = getAgentById(agentId)

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    if (!agent.isActive) {
      return NextResponse.json({ error: "Agent is not active" }, { status: 403 })
    }

    // Get user from database
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, phone")
      .eq("email", session.user.email)
      .single()

    const userId = user?.id || session.user.email

    // Create agent run record
    const { data: agentRun, error: insertError } = await supabaseAdmin
      .from("agent_runs")
      .insert({
        agent_id: agentId,
        user_id: userId,
        input,
        status: "pending",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Failed to create agent run:", insertError)
      return NextResponse.json({ error: "Failed to create agent run" }, { status: 500 })
    }

    // Run the agent
    try {
      const result = await runAgentPrompt(input, {
        model: agent.model,
        systemPrompt: agent.instructions,
        temperature: 0,
        maxTokens: 2000,
      })

      // Update agent run with result
      await supabaseAdmin
        .from("agent_runs")
        .update({
          output: result.output,
          status: "completed",
          tokens_used: result.tokensUsed,
          duration_ms: result.durationMs,
        })
        .eq("id", agentRun.id)

      // Send SMS notification if requested and phone number available
      if (notifyViaSMS && user?.phone) {
        try {
          await sendAgentNotification(user.phone, agent.name, result.output)
        } catch (smsError) {
          console.error("Failed to send SMS notification:", smsError)
          // Don't fail the request if SMS fails
        }
      }

      return NextResponse.json({
        runId: agentRun.id,
        output: result.output,
        status: "completed",
        tokensUsed: result.tokensUsed,
        durationMs: result.durationMs,
      })
    } catch (error) {
      // Update agent run with error
      await supabaseAdmin
        .from("agent_runs")
        .update({
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        })
        .eq("id", agentRun.id)

      throw error
    }
  } catch (error) {
    console.error("Agent run error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Agent execution failed" },
      { status: 500 },
    )
  }
}

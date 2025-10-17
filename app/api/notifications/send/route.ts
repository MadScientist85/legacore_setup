import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sendEmail, emailTemplates } from "@/lib/email/resend-client"
import { sendSMS, smsTemplates } from "@/lib/sms/twilio-client"
import { supabase } from "@/lib/supabase/client"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { userId, type, channel, data } = body

    // Validate request
    if (!userId || !type || !channel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("email, full_name, phone")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let emailResult = null
    let smsResult = null

    // Send email notification
    if (channel === "email" || channel === "both") {
      let template
      switch (type) {
        case "welcome":
          template = emailTemplates.welcome(user.full_name || "User", data.companyName || "LEGACORE")
          break
        case "document_processed":
          template = emailTemplates.documentProcessed(user.full_name || "User", data.documentName, data.documentUrl)
          break
        case "payment_success":
          template = emailTemplates.paymentSuccess(user.full_name || "User", data.amount, data.planName)
          break
        case "agent_complete":
          template = emailTemplates.agentComplete(user.full_name || "User", data.agentName, data.taskSummary)
          break
        default:
          return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
      }

      emailResult = await sendEmail({
        to: user.email,
        ...template,
      })
    }

    // Send SMS notification
    if ((channel === "sms" || channel === "both") && user.phone) {
      let message
      switch (type) {
        case "welcome":
          message = smsTemplates.welcome(user.full_name || "User")
          break
        case "document_processed":
          message = smsTemplates.documentProcessed(data.documentName)
          break
        case "payment_success":
          message = smsTemplates.paymentSuccess(data.amount, data.planName)
          break
        case "agent_complete":
          message = smsTemplates.agentComplete(data.agentName)
          break
        default:
          return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
      }

      smsResult = await sendSMS(user.phone, message)
    }

    // Log notification
    await supabase.from("notification_logs").insert({
      user_id: userId,
      type,
      channel,
      email_status: emailResult?.success ? "sent" : emailResult ? "failed" : "skipped",
      sms_status: smsResult?.success ? "sent" : smsResult ? "failed" : "skipped",
      data,
    })

    return NextResponse.json({
      success: true,
      email: emailResult,
      sms: smsResult,
    })
  } catch (error) {
    console.error("Notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

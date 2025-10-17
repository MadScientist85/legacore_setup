import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const phoneNumber = process.env.TWILIO_PHONE_NUMBER

let twilioClient: ReturnType<typeof twilio> | null = null

function getTwilioClient() {
  if (!twilioClient) {
    if (!accountSid || !authToken) {
      console.warn("Twilio credentials not configured")
      return null
    }
    twilioClient = twilio(accountSid, authToken)
  }
  return twilioClient
}

export async function sendSMS(to: string, body: string): Promise<{ success: boolean; error?: string }> {
  const client = getTwilioClient()

  if (!client || !phoneNumber) {
    console.warn("Twilio not configured, skipping SMS")
    return { success: false, error: "Twilio not configured" }
  }

  try {
    await client.messages.create({
      from: phoneNumber,
      to,
      body,
    })
    return { success: true }
  } catch (error) {
    console.error("Twilio SMS error:", error)
    return { success: false, error: String(error) }
  }
}

export const smsTemplates = {
  welcome: (name: string) =>
    `Welcome to LEGACORE, ${name}! Your account is now active. Log in to get started: https://legacore.com`,

  documentProcessed: (documentName: string) =>
    `Your document "${documentName}" has been processed and is ready to view. Check your dashboard for details.`,

  paymentSuccess: (amount: number, planName: string) =>
    `Payment of $${amount.toFixed(2)} received for ${planName}. Thank you! Your subscription is now active.`,

  agentComplete: (agentName: string) =>
    `${agentName} has completed your task. Log in to view the results: https://legacore.com/dashboard`,

  taskReminder: (taskName: string, dueDate: string) =>
    `Reminder: "${taskName}" is due on ${dueDate}. Complete it in your dashboard.`,
}

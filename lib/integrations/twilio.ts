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

export async function sendSMS(to: string, body: string): Promise<boolean> {
  const client = getTwilioClient()

  if (!client || !phoneNumber) {
    console.warn("Twilio not configured, skipping SMS")
    return false
  }

  try {
    await client.messages.create({
      from: phoneNumber,
      to,
      body,
    })
    return true
  } catch (error) {
    console.error("Twilio SMS error:", error)
    return false
  }
}

export async function sendAgentNotification(to: string, agentName: string, result: string): Promise<boolean> {
  const truncatedResult = result.substring(0, 100) + (result.length > 100 ? "..." : "")
  const body = `${agentName} has completed your request. Result: ${truncatedResult}`

  return sendSMS(to, body)
}

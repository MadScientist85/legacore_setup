import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
}

export async function sendEmail(template: EmailTemplate) {
  try {
    const { data, error } = await resend.emails.send({
      from: template.from || "LEGACORE <noreply@legacore.com>",
      to: template.to,
      subject: template.subject,
      html: template.html,
      replyTo: template.replyTo,
      cc: template.cc,
      bcc: template.bcc,
    })

    if (error) {
      console.error("Email send error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Email send exception:", error)
    return { success: false, error: String(error) }
  }
}

export const emailTemplates = {
  welcome: (name: string, companyName: string) => ({
    subject: `Welcome to ${companyName}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${companyName}!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>We're thrilled to have you on board! Your account has been successfully created and you're ready to start using our AI-powered platform.</p>
              <p>Here's what you can do next:</p>
              <ul>
                <li>Explore our AI agents</li>
                <li>Upload your first document</li>
                <li>Start a conversation with an agent</li>
                <li>Set up your profile</li>
              </ul>
              <a href="https://legacore.com/dashboard" class="button">Go to Dashboard</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 ${companyName}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  documentProcessed: (name: string, documentName: string, documentUrl: string) => ({
    subject: "Document Processing Complete",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .document-info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #10b981; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Document Processed</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Your document has been successfully processed and analyzed!</p>
              <div class="document-info">
                <strong>Document:</strong> ${documentName}<br>
                <strong>Status:</strong> Processing Complete
              </div>
              <a href="${documentUrl}" class="button">View Document</a>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  paymentSuccess: (name: string, amount: number, planName: string) => ({
    subject: "Payment Successful",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .payment-details { background: white; padding: 20px; border-radius: 5px; margin: 15px 0; }
            .amount { font-size: 36px; font-weight: bold; color: #3b82f6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💳 Payment Received</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for your payment! Your transaction was successful.</p>
              <div class="payment-details">
                <div class="amount">$${amount.toFixed(2)}</div>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p>Your subscription is now active and you have full access to all features.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  agentComplete: (name: string, agentName: string, taskSummary: string) => ({
    subject: `${agentName} Completed Your Task`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .task-summary { background: white; padding: 20px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤖 Task Complete</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Great news! <strong>${agentName}</strong> has completed your task.</p>
              <div class="task-summary">
                <h3>Summary:</h3>
                <p>${taskSummary}</p>
              </div>
              <a href="https://legacore.com/dashboard/chat" class="button">View Full Results</a>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}

export interface ZapierWebhook {
  url: string
  event: string
  active: boolean
}

export class ZapierClient {
  async sendWebhook(webhookUrl: string, data: any): Promise<boolean> {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      return response.ok
    } catch (error) {
      console.error("Zapier webhook error:", error)
      return false
    }
  }

  async triggerEvent(eventName: string, data: any, webhooks: ZapierWebhook[]): Promise<void> {
    const activeWebhooks = webhooks.filter((w) => w.active && w.event === eventName)

    await Promise.all(activeWebhooks.map((webhook) => this.sendWebhook(webhook.url, data)))
  }
}

export const zapierEvents = {
  USER_CREATED: "user.created",
  DOCUMENT_UPLOADED: "document.uploaded",
  DOCUMENT_PROCESSED: "document.processed",
  PAYMENT_SUCCEEDED: "payment.succeeded",
  AGENT_COMPLETED: "agent.completed",
  SUBSCRIPTION_CREATED: "subscription.created",
  SUBSCRIPTION_CANCELLED: "subscription.cancelled",
}

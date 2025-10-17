import type { Metadata } from "next"
import { SubscriptionPlans } from "@/components/payment/subscription-plans"
import { PaymentHistory } from "@/components/payment/payment-history"

export const metadata: Metadata = {
  title: "Billing - LEGACORE",
  description: "Manage your subscription and billing",
}

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription plan and view payment history</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Choose Your Plan</h2>
        <SubscriptionPlans />
      </div>

      <div>
        <PaymentHistory />
      </div>
    </div>
  )
}

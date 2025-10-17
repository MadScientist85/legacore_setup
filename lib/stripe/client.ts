import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
})

export const STRIPE_PLANS = {
  basic: {
    name: "Basic Plan",
    price: 4900, // $49.00
    interval: "month" as const,
    features: ["5 AI Agents", "100 Documents/month", "Email Support", "Basic Analytics"],
  },
  professional: {
    name: "Professional Plan",
    price: 14900, // $149.00
    interval: "month" as const,
    features: [
      "25 AI Agents",
      "Unlimited Documents",
      "Priority Support",
      "Advanced Analytics",
      "Custom Workflows",
      "API Access",
    ],
  },
  enterprise: {
    name: "Enterprise Plan",
    price: 49900, // $499.00
    interval: "month" as const,
    features: [
      "Unlimited AI Agents",
      "Unlimited Documents",
      "24/7 Dedicated Support",
      "Custom AI Training",
      "White-label Options",
      "SLA Guarantee",
      "Dedicated Account Manager",
    ],
  },
}

export type PlanType = keyof typeof STRIPE_PLANS

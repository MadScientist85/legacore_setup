"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Check, Loader2 } from "lucide-react"
import { STRIPE_PLANS, type PlanType } from "@/lib/stripe/client"

export function SubscriptionPlans() {
  const [loading, setLoading] = useState<PlanType | null>(null)
  const { toast } = useToast()

  const handleSubscribe = async (plan: PlanType) => {
    setLoading(plan)

    try {
      const response = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })

      if (!response.ok) throw new Error("Failed to create subscription")

      const { clientSecret, subscriptionId } = await response.json()

      toast({
        title: "Subscription Created",
        description: `You're now subscribed to the ${STRIPE_PLANS[plan].name}`,
      })

      // In production, redirect to Stripe checkout or use Stripe Elements
      window.location.href = "/dashboard/billing"
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Unable to create subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {(Object.keys(STRIPE_PLANS) as PlanType[]).map((key) => {
        const plan = STRIPE_PLANS[key]
        const isPopular = key === "professional"

        return (
          <Card key={key} className={isPopular ? "border-primary shadow-lg" : ""}>
            <CardHeader>
              {isPopular && <div className="text-xs font-semibold text-primary mb-2">MOST POPULAR</div>}
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">${(plan.price / 100).toFixed(0)}</span>
                <span className="text-muted-foreground">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSubscribe(key)}
                disabled={loading !== null}
                variant={isPopular ? "default" : "outline"}
              >
                {loading === key ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

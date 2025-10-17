import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe, STRIPE_PLANS, type PlanType } from "@/lib/stripe/client"
import { supabaseAdmin } from "@/lib/supabase/client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { plan } = body as { plan: PlanType }

    if (!STRIPE_PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // Get or create Stripe customer
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("stripe_customer_id")
      .eq("email", session.user.email)
      .single()

    let customerId = user?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      })

      customerId = customer.id

      await supabaseAdmin.from("users").update({ stripe_customer_id: customerId }).eq("email", session.user.email)
    }

    // Create or get price
    const planData = STRIPE_PLANS[plan]
    const prices = await stripe.prices.list({
      lookup_keys: [`${plan}_plan`],
    })

    let priceId = prices.data[0]?.id

    if (!priceId) {
      const price = await stripe.prices.create({
        unit_amount: planData.price,
        currency: "usd",
        recurring: { interval: planData.interval },
        product_data: {
          name: planData.name,
          metadata: { plan },
        },
        lookup_key: `${plan}_plan`,
      })
      priceId = price.id
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId: session.user.id,
        plan,
      },
    })

    // Save subscription to database
    await supabaseAdmin.from("subscriptions").insert({
      user_id: session.user.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      plan,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })

    const invoice = subscription.latest_invoice as any
    const paymentIntent = invoice?.payment_intent

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
      status: subscription.status,
    })
  } catch (error) {
    console.error("Create subscription error:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}

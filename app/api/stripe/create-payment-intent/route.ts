import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe/client"
import { supabaseAdmin } from "@/lib/supabase/client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, description, metadata } = body

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Invalid amount. Minimum $0.50" }, { status: 400 })
    }

    // Create or retrieve Stripe customer
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

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customerId,
      description: description || "LEGACORE Payment",
      metadata: {
        userId: session.user.id,
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Log payment intent
    await supabaseAdmin.from("payment_history").insert({
      user_id: session.user.id,
      stripe_payment_intent_id: paymentIntent.id,
      amount,
      currency: "usd",
      status: "pending",
      description,
      metadata,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Create payment intent error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}

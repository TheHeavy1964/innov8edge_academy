import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { priceId, returnUrl, userId, userEmail } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    // Guard: if no real Stripe key, return mock redirect for dev testing
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("mock")) {
      console.warn("No real Stripe key — returning mock URL");
      return NextResponse.json({ url: `${returnUrl}?session_id=mock_session&mock=true` });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      // Link this Stripe session to the Supabase user — used by the webhook
      client_reference_id: userId || undefined,
      customer_email: userEmail || undefined,
      // Collect billing address for tax purposes
      billing_address_collection: "auto",
      // Allow promotion codes
      allow_promotion_codes: true,
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&upgraded=true`,
      cancel_url: `${returnUrl}?cancelled=true`,
      subscription_data: {
        metadata: {
          user_id: userId || "",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

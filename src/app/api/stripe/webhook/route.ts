import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    console.error("Missing webhook secret or signature");
    return NextResponse.json({ error: "Webhook configuration error" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Event: ${event.type}`);

  switch (event.type) {
    // ✅ Subscription started or paid successfully
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const userId = session.client_reference_id;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      if (!userId) {
        console.error("No client_reference_id on session — cannot update user");
        break;
      }

      // Update Supabase user_metadata with Pro tier + Stripe IDs
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          tier: "pro",
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        },
      });

      if (error) {
        console.error("Failed to upgrade user to Pro:", error.message);
        return NextResponse.json({ error: "DB update failed" }, { status: 500 });
      }
      console.log(`✅ User ${userId} upgraded to Pro`);
      break;
    }

    // ✅ Subscription renewed
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any;
      const customerId = invoice.customer;

      // Find user by stripe_customer_id in user_metadata
      // Supabase doesn't support querying user_metadata directly, so we
      // use the profiles table if you have one, or skip renewals for now.
      console.log(`Invoice paid for customer: ${customerId}`);
      break;
    }

    // ❌ Subscription cancelled or expired
    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      const customerId = subscription.customer;

      // Look up user by customerId in profiles table (if tracked)
      // For now, log it — a full implementation would downgrade the user
      console.log(`⚠️ Subscription cancelled for customer: ${customerId}`);
      break;
    }

    // ❌ Payment failed
    case "invoice.payment_failed": {
      const invoice = event.data.object as any;
      console.warn(`Payment failed for customer: ${invoice.customer}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

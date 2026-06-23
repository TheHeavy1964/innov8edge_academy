import Stripe from "stripe";

// Provide a dummy key if not set, so the app doesn't crash on compilation
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2026-04-22.dahlia", // Required by installed stripe package version
  appInfo: {
    name: "Innov8Edge Academy",
    version: "0.1.0",
  },
});

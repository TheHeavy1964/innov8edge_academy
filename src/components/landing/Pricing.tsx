"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  Star,
  Building,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Real Stripe Price IDs — set in .env.local
const PRICE_PRO_MONTHLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly";
const PRICE_PRO_ANNUAL  = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL  || "price_pro_annual";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring what AI can do",
    icon: Sparkles,
    gradient: "from-[#4CBB17] to-[#A1CCA5]",
    features: [
      "Beginner lessons",
      "10 sandbox runs per day",
      "Community workflows",
      "Prompt Playground (basic)",
      "AI glossary access",
      '"Explain Like I\'m Human" mode',
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious AI automation learners",
    icon: Zap,
    gradient: "from-[#415D43] to-[#8FB996]",
    features: [
      "All learning paths",
      "Unlimited sandbox runs",
      "Workflow Builder",
      "Agent Simulator",
      "MCP Playground",
      "AI-powered tutor",
      "Export & share workflows",
      '"See Inside the AI" layer',
      "Priority support",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    period: "/seat/mo",
    description: "For teams, schools, and organizations",
    icon: Building,
    gradient: "from-[#709775] to-[#415D43]",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Admin dashboard",
      "Progress analytics",
      "Custom learning paths",
      "Bulk user management",
      "SSO & SAML",
      "Dedicated support",
      "Volume discounts",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();

  const handleCheckout = async (planId: string) => {
    if (planId === "free") {
      window.location.href = "/auth";
      return;
    }
    if (planId === "team") {
      window.location.href = "mailto:hello@innov8edge.io?subject=Team Plan Inquiry";
      return;
    }

    try {
      setLoading(planId);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: annual ? PRICE_PRO_ANNUAL : PRICE_PRO_MONTHLY,
          returnUrl: window.location.origin + "/dashboard",
          userId: user?.id,
          userEmail: user?.email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe error:", data.error);
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Could not connect to payment processor.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="section relative">
      {/* Divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-30" />

      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge mx-auto mb-5">
            <Star className="w-3.5 h-3.5" />
            Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Start Free.
            <br />
            <span className="gradient-text">Scale When Ready.</span>
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
            No credit card required. Learn at your own pace.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          <span className={`text-sm font-medium ${!annual ? "text-white" : "text-[var(--muted)]"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              annual ? "bg-[var(--primary)]" : "bg-[var(--surface-elevated)]"
            } border border-[var(--border-color)]`}
            id="pricing-toggle"
            aria-label="Toggle billing period"
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                annual ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? "text-white" : "text-[var(--muted)]"}`}>
            Annual
            <span className="ml-1.5 text-xs text-[var(--accent)]">Save 20%</span>
          </span>
        </motion.div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative ${plan.popular ? "md:-mt-4 md:mb-[-16px]" : ""}`}
            id={`pricing-${plan.id}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="badge !bg-gradient-to-r !from-[#415D43] !to-[#8FB996] !border-none !text-white">
                  <Star className="w-3 h-3" />
                  Most Popular
                </div>
              </div>
            )}

            <div
              className={`card h-full flex flex-col ${
                plan.popular
                  ? "border-[rgba(161,204,165,0.35)] shadow-[0_0_40px_rgba(143,185,150,0.12)]"
                  : ""
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}
                >
                  <plan.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                </div>
              </div>

              {/* Price */}
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-white">
                  {plan.price === "$0"
                    ? "$0"
                    : annual
                    ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
                    : plan.price}
                </span>
                <span className="text-sm text-[var(--muted)]">{plan.period}</span>
              </div>
              <p className="text-sm text-[var(--muted)] mb-6">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <span className="text-[var(--muted)]">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  plan.popular
                    ? "btn-primary !rounded-xl"
                    : "btn-secondary !rounded-xl"
                } ${loading === plan.id ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading === plan.id ? "Loading..." : plan.cta}
                {loading !== plan.id && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Education note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <div className="glass inline-flex items-center gap-3 px-6 py-3 rounded-xl text-sm">
          <GraduationCap className="w-5 h-5 text-[var(--primary-light)]" />
          <span className="text-[var(--muted)]">
            <span className="text-white font-medium">Education & Enterprise</span> — Custom pricing for schools, bootcamps, and corporations.
          </span>
          <a href="mailto:hello@innov8edge.io?subject=Education Inquiry" className="text-[var(--primary-light)] font-semibold hover:underline">
            Contact us →
          </a>
        </div>
      </motion.div>
    </section>
  );
}

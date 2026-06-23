import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0A120B] text-white pt-32 pb-24 relative">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(143,185,150,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-black mb-8">Privacy Policy</h1>
        <p className="text-[var(--muted)] mb-12">Last Updated: May 12, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="text-[var(--muted)]">We collect information you provide directly to us when you create an account, use our AI sandboxes, or communicate with us. This may include your name, email address, and usage data within our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-[var(--muted)]">We use the information we collect to provide, maintain, and improve our services, including the AI Tutor and Sandbox environments. We also use your information to communicate with you about updates and features.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
            <p className="text-[var(--muted)]">We use industry-standard security measures to protect your information. Your data is stored securely using Supabase and encrypted where appropriate.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
            <p className="text-[var(--muted)]">We use Stripe for payment processing. Stripe has their own privacy policy regarding your financial information. We do not store your credit card details on our servers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
            <p className="text-[var(--muted)]">If you have any questions about this Privacy Policy, please contact us at support@innov8edge.sbs.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

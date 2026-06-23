import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0A120B] text-white pt-32 pb-24 relative">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(143,185,150,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-black mb-8">Terms of Service</h1>
        <p className="text-[var(--muted)] mb-12">Last Updated: May 12, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-[var(--muted)]">By accessing or using Innov8Edge Academy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-[var(--muted)]">Innov8Edge Academy provides an interactive learning platform for AI automation. We provide various sandboxes, lessons, and community tools.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Subscriptions and Payments</h2>
            <p className="text-[var(--muted)]">Certain features require a paid subscription. All payments are processed through Stripe. By subscribing, you agree to our pricing terms and recurring billing cycle.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Conduct</h2>
            <p className="text-[var(--muted)]">Users may not use our AI sandboxes for any illegal activities, including but not limited to generating malware, phishing content, or violating the terms of service of the underlying AI model providers (e.g., OpenAI, Google).</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
            <p className="text-[var(--muted)]">Innov8Edge Academy is provided "as is". We are not responsible for any loss of data or business interruptions caused by the use of our platform.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

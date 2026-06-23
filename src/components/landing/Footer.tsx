"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  MessageCircle,
  Share2,
  Rss,
  Mail,
  ChevronRight,
} from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Features", href: "/#features" },
    { label: "Sandboxes", href: "/#sandboxes" },
    { label: "Learning Paths", href: "/#paths" },
    { label: "Pricing", href: "/pricing" },
    { label: "Marketplace", href: "/marketplace" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Blog", href: "/blog" },
    { label: "Tutorials", href: "#" },
    { label: "Community", href: "#" },
    { label: "MCP Reference", href: "/notebooklm-reference" },
  ],
  Company: [
    { label: "About Innov8Edge", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "mailto:hello@innov8edge.io" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

const socials = [
  { icon: Globe, href: "#", label: "Website" },
  { icon: MessageCircle, href: "#", label: "Community" },
  { icon: Share2, href: "#", label: "Share" },
  { icon: Rss, href: "#", label: "RSS" },
];

export default function Footer() {
  return (
    <footer className="relative mt-24">
      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 mb-20"
      >
        <div className="relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center" style={{ background: "var(--gradient-primary)" }}>
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                               radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to Become an AI Builder?
            </h2>
            <p className="text-lg text-white/70 max-w-lg mx-auto mb-8">
              Join thousands of learners mastering AI automation through hands-on practice. Start free — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth"
                id="footer-cta-start"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#415D43] font-bold text-base rounded-xl hover:bg-white/90 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#"
                id="footer-cta-demo"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold text-base rounded-xl hover:bg-white/10 transition-all"
              >
                Watch Demo
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Content */}
      <div className="border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-5 group">
                <Image
                  src="/logo.png"
                  alt="Innov8Edge"
                  width={120}
                  height={34}
                  className="h-8 w-auto object-contain"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] self-end mb-0.5">
                  Academy
                </span>
              </Link>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">
                The fastest way for ordinary people to become AI builders.
              </p>

              {/* Newsletter */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    id="footer-email-input"
                    className="w-full pl-9 pr-3 py-2.5 bg-[var(--surface)] border border-[var(--border-color)] rounded-lg text-sm text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
                <button
                  id="footer-email-submit"
                  className="px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Join
                </button>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-bold text-white mb-4">{category}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-[var(--muted)] hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--muted)]">
              © {new Date().getFullYear()} Innov8Edge. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--muted)] hover:text-white hover:border-[var(--primary)] transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

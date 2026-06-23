"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Sandboxes", href: "/#sandboxes" },
  { label: "Learning Paths", href: "/#paths" },
  { label: "MCP Reference", href: "/notebooklm-reference" },
  { label: "Pricing", href: "/pricing" },
  { label: "Videos", href: "/library" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group" id="nav-logo">
          <Image
            src="/logo.png"
            alt="Innov8Edge Academy"
            width={160}
            height={45}
            className="h-6 sm:h-9 w-auto object-contain group-hover:brightness-110 transition-all duration-300"
            priority
          />
          <span className="text-[10px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] ml-0.5 self-end mb-0.5">
            Academy
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              id={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
              className="px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth"
            id="nav-login"
            className="px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/auth"
            id="nav-cta"
            className="btn-primary !py-2.5 !px-5 !text-sm !rounded-lg !shadow-[0_4px_20px_rgba(143,185,150,0.25)]"
          >
            <GraduationCap className="w-4 h-4" />
            Start Free
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          id="nav-mobile-toggle"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-[var(--border-color)]"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[var(--muted)] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex flex-col gap-2">
                <Link href="/auth" className="btn-secondary !text-sm !py-2.5">
                  Log In
                </Link>
                <Link href="/auth" className="btn-primary !text-sm !py-2.5">
                  <GraduationCap className="w-4 h-4" />
                  Start Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

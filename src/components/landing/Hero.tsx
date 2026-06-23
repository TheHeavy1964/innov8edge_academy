"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Zap,
  Users,
  Bot,
} from "lucide-react";
import Link from "next/link";

/* Animated floating orbs in the background */
function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Main glow */}
      <div className="absolute top-[-20%] left-[20%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-[radial-gradient(circle,rgba(161,204,165,0.18)_0%,transparent_70%)] animate-pulse-glow" />
      <div className="absolute top-[10%] right-[10%] w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-[radial-gradient(circle,rgba(65,93,67,0.12)_0%,transparent_70%)]" style={{ animation: "float 8s ease-in-out infinite 1s" }} />
      <div className="absolute bottom-[-10%] left-[50%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-[radial-gradient(circle,rgba(143,185,150,0.1)_0%,transparent_70%)]" style={{ animation: "float 10s ease-in-out infinite 2s" }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(143,185,150,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(143,185,150,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

/* Animated stats */
const stats = [
  { icon: Users, value: "10K+", label: "Learners" },
  { icon: Bot, value: "50+", label: "Sandboxes" },
  { icon: Zap, value: "200+", label: "Lessons" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-[72px] overflow-hidden"
    >
      <BackgroundOrbs />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="badge animate-shimmer">
            <Zap className="w-3.5 h-3.5" />
            The AI Automation Era is Here
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6"
        >
          Learn AI Automation
          <br />
          <span className="gradient-text">by Building</span>{" "}
          <span className="gradient-text-accent">Real Systems</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base sm:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Master AI workflows, agents, MCP, and prompt engineering
          through <span className="text-white font-medium">hands-on interactive sandboxes</span>.
          No coding experience required.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/learn" className="btn-primary text-lg px-10 py-4" id="hero-cta-start">
            Start Learning Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#sandboxes" className="btn-secondary text-lg px-10 py-4" id="hero-cta-demo">
            <Play className="w-5 h-5" />
            Try a Sandbox
          </a>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex items-center justify-center gap-5 sm:gap-16 flex-wrap"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-[var(--primary-light)]" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-[var(--muted)]">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Hero Visual — Sandbox Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 relative mx-auto max-w-4xl"
        >
          <div className="gradient-border p-1 rounded-2xl">
            <div className="glass rounded-2xl overflow-hidden">
              {/* Mock Toolbar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border-color)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-[var(--surface)] text-xs text-[var(--muted)] font-mono hidden sm:block">
                    sandbox.innov8edge.academy/prompt-playground
                  </div>
                </div>
              </div>

              {/* Mock Content */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Left: Prompt Input */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary-light)]">
                      <Zap className="w-4 h-4" />
                      Prompt Input
                    </div>
                    <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--border-color)]">
                      <div className="text-xs text-[var(--muted)] mb-2 font-mono">system_prompt:</div>
                      <div className="text-sm text-[var(--foreground)] leading-relaxed">
                        You are a research assistant. Find the top 3 trends in
                        AI automation for 2026 and format them as bullet points...
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="badge !bg-[rgba(76,187,23,0.1)] !border-[rgba(76,187,23,0.2)] !text-[var(--accent)]">
                        GPT-4o
                      </div>
                      <div className="badge">Claude 4</div>
                      <div className="badge">Gemini 3</div>
                    </div>
                  </div>

                  {/* Right: Output */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                      <Bot className="w-4 h-4" />
                      AI Response
                    </div>
                    <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--border-color)]">
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-2">
                          <span className="text-[var(--accent)]">1.</span>
                          <span className="text-[var(--foreground)]">
                            Agentic workflows replace single-prompt interactions
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[var(--accent)]">2.</span>
                          <span className="text-[var(--foreground)]">
                            MCP becomes the standard for AI-tool communication
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[var(--accent)]">3.</span>
                          <span className="text-[var(--foreground)]">
                            Multi-agent orchestration for complex business tasks
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                      <span>⚡ 342 tokens</span>
                      <span>•</span>
                      <span>1.2s latency</span>
                      <span>•</span>
                      <span className="text-[var(--success)]">● Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow behind the card */}
          <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,rgba(143,185,150,0.1)_0%,transparent_70%)] -z-10 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}

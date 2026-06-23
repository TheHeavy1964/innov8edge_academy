"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, Terminal, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/components/analytics/AnalyticsProvider";

interface SandboxCTAProps {
  title: string;
  description: string;
  type?: "agent" | "mcp" | "workflow";
  fakeInput?: string;
  fakeOutput?: string;
}

export default function SandboxCTA({
  title = "Live Sandbox Preview",
  description = "See how it works in real-time.",
  type = "agent",
  fakeInput = "Extract the key revenue metrics from Q3_Report.pdf",
  fakeOutput = "Analyzing Document...\nFound 3 core metrics:\n- Total Revenue: $4.2M (+14% QoQ)\n- Net Margin: 22%\n- Customer Acquisition Cost: $120\n\nTask Complete. Ready for next command."
}: SandboxCTAProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    trackEvent("sandbox_run_preview", { type, title });
    // Simulate execution time
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 2000);
  };

  return (
    <div className="my-12 relative rounded-3xl overflow-hidden border border-[var(--border-color)] bg-[#0A120B] shadow-2xl group">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--muted)]" />
          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 md:p-6 relative min-h-[300px] flex flex-col">
        <p className="text-[var(--muted)] text-xs md:text-sm mb-6">{description}</p>

        {/* Fake Input */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider mb-2">User Prompt:</div>
          <div className="bg-black/50 border border-white/5 rounded-xl p-3 text-sm font-mono text-white/90">
            {fakeInput}
          </div>
        </div>

        {/* Fake Output Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {!isRunning && !hasRun ? (
              <motion.div
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <button
                  onClick={handleRun}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-sm shadow-lg shadow-[var(--accent)]/20 hover:scale-105 transition-all"
                >
                  <Play className="w-4 h-4" />
                  Run Simulation
                </button>
              </motion.div>
            ) : isRunning ? (
              <motion.div
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest animate-pulse">
                  Agent Executing...
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="output"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--hunter-green)]/10 border border-[var(--primary)]/20 rounded-xl p-4 h-full"
              >
                <div className="text-[10px] font-bold text-[var(--celadon)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> System Output:
                </div>
                <pre className="text-sm font-mono text-white/80 whitespace-pre-wrap leading-relaxed">
                  {fakeOutput}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The CTA Overlay - Appears after run */}
        <AnimatePresence>
          {hasRun && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A120B] via-[#0A120B] to-transparent pt-20"
            >
              <div className="glass-strong border border-[var(--accent)]/30 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--accent)]/5" />
                <Lock className="w-6 h-6 text-[var(--accent)] mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2 relative z-10">Want to build this yourself?</h4>
                <p className="text-sm text-[var(--muted)] mb-6 relative z-10">
                  This was just a simulation. Unlock the full interactive Agent Simulator and build real automations.
                </p>
                <Link 
                  href="/auth" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-sm shadow-lg shadow-[var(--accent)]/20 hover:-translate-y-1 transition-all relative z-10"
                >
                  Start 7-Day Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Play, 
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  Award,
  Star,
  Zap
} from "lucide-react";
import { useState } from "react";

import { useProgress } from "@/hooks/useProgress";

const trackDefinitions: Record<string, any> = {
  beginner: {
    title: "AI Foundations",
    color: "#4CBB17",
    lessons: [
      { id: '1', title: "What is AI?", type: "mechanics" },
      { id: '2', title: "What is an LLM?", type: "mechanics" },
      { id: '3', title: "Prompt Engineering Basics", type: "how" },
      { id: '4', title: "AI Memory & Context", type: "how" },
      { id: '5', title: "AI Ethics & Bias", type: "responsibility" },
      { id: '6', title: "Security & Privacy", type: "responsibility" },
      { id: '7', title: "Identifying AI Opportunities", type: "what" },
      { id: '8', title: "The AI Decision Matrix", type: "when" },
      { id: '9', title: "Building the Business Case", type: "why" },
    ]
  },
  intermediate: {
    title: "The Automation Stack",
    color: "#A1CCA5",
    lessons: [
      { id: '10', title: "MCP Explained", type: "intro" },
      { id: '11', title: "The API Economy & Webhooks", type: "what" },
      { id: '12', title: "Visual AI Workflows", type: "core" },
      { id: '13', title: "Human-in-the-Loop Design", type: "when" },
      { id: '14', title: "RAG & Vector Data", type: "core" },
      { id: '15', title: "Data Pipeline Ethics & Privacy", type: "why" },
      { id: '16', title: "Advanced Tool Calling", type: "core" },
      { id: '17', title: "Debugging & Error Handling in AI", type: "how" },
    ]
  },
  builder: {
    title: "Agent Engineering",
    color: "#D4A843",
    lessons: [
      { id: '18', title: "Building Your First Agent", type: "core" },
      { id: '19', title: "Agentic Governance & Guardrails", type: "when" },
      { id: '20', title: "Multi-Agent Systems", type: "core" },
      { id: '21', title: "Cost-Benefit Analysis for Autonomy", type: "what" },
      { id: '22', title: "Agentic Error Handling", type: "how" },
      { id: '23', title: "The Intent-Action Gap", type: "why" },
      { id: '24', title: "Real-world Deployment", type: "core" },
      { id: '25', title: "Red-Teaming Your Agents", type: "how" },
    ]
  },
  business: {
    title: "AI for Business",
    color: "#709775",
    lessons: [
      { id: '26', title: "AI for Realtors", type: "industry" },
      { id: '27', title: "AI for Restaurants", type: "industry" },
      { id: '28', title: "AI for Small Businesses", type: "industry" },
      { id: '29', title: "AI for Content Creators", type: "industry" },
      { id: '30', title: "AI for Consultants", type: "industry" },
      { id: '31', title: "AI for Ecommerce", type: "industry" },
      { id: '32', title: "AI for HR & Talent Management", type: "industry" },
      { id: '33', title: "AI for Finance & Accounting", type: "industry" },
    ]
  },
  expert: {
    title: "AI Operations (AIOps)",
    color: "#A78BFA",
    lessons: [
      { id: '34', title: "The AI Lifecycle: From Pilot to Production", type: "when" },
      { id: '35', title: "Monitoring & Observability", type: "what" },
      { id: '36', title: "The Human-AI Collaboration Model", type: "why" },
      { id: '37', title: "AI Evaluation & Benchmarking (Evals)", type: "how" },
      { id: '38', title: "Security Ops: Defending the AI Perimeter", type: "how" },
      { id: '39', title: "AI Governance & Policy", type: "when" },
      { id: '40', title: "Scaling Your AI Workforce", type: "core" },
      { id: '41', title: "AIOps Capstone: Your AI Operations Playbook", type: "core" },
    ]
  },

};

export default function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = use(params);
  const { progress, loading, resetTrack } = useProgress();
  const [resetConfirm, setResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  if (loading) return null;

  const baseData = trackDefinitions[track as keyof typeof trackDefinitions] || trackDefinitions.beginner;
  
  // Calculate dynamic status for each lesson
  const lessons = baseData.lessons.map((lesson: any, index: number) => {
    const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
    let status = 'locked';
    
    if (lessonProgress?.status === 'completed') {
      status = 'completed';
    } else if (index === 0 || progress.find(p => p.lesson_id === baseData.lessons[index - 1].id)?.status === 'completed') {
      status = 'active';
    }
    
    return { ...lesson, status };
  });

  const handleReset = async () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
      return;
    }

    setIsResetting(true);
    const lessonIds = lessons.map((l: any) => l.id);
    await resetTrack(lessonIds);
    setIsResetting(false);
    setResetConfirm(false);
  };

  const data = { ...baseData, lessons };
  const completedCount = lessons.filter((l: any) => l.status === 'completed').length;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link 
          href="/learn" 
          className="w-10 h-10 rounded-xl glass-strong border border-[var(--border-color)] flex items-center justify-center text-[var(--muted)] hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white">{data.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Learning Path</span>
            <div className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">{completedCount}/{data.lessons.length} Lessons Done</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          disabled={isResetting}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
            resetConfirm 
              ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse" 
              : "bg-white/5 text-[var(--muted)] hover:text-white hover:bg-white/10 border border-white/5"
          }`}
        >
          {isResetting ? (
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : resetConfirm ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : (
            <RotateCcw className="w-3.5 h-3.5" />
          )}
          {resetConfirm ? "Click to confirm reset" : "Reset Track"}
        </button>
      </div>

      {/* The Tree */}
      <div className="relative py-10">
        {/* Connection Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[var(--border-color)] -translate-x-1/2 z-0" />

        <div className="space-y-24 relative z-10">
          {data.lessons.map((lesson: any, i: number) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`flex items-center gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse text-right"}`}
            >
              {/* Node content */}
              <div className="flex-1">
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`glass-strong p-6 rounded-2xl border transition-all duration-300 ${
                    lesson.status === "active" 
                      ? "border-[var(--accent)] shadow-[0_0_30px_rgba(76,187,23,0.15)] bg-[rgba(76,187,23,0.05)]" 
                      : lesson.status === "locked"
                      ? "opacity-50 border-white/5"
                      : "border-white/10"
                  }`}
                >
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                    lesson.status === "active" ? "text-[var(--accent)]" : "text-[var(--muted)]"
                  }`}>
                    Lesson {lesson.id} • {lesson.type}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{lesson.title}</h3>
                  
                  {lesson.status === "active" ? (
                    <Link 
                      href={`/learn/${track}/lesson/${lesson.id}`}
                      className="btn-primary !py-2 !px-4 !text-xs inline-flex"
                    >
                      Resume Lesson <Play className="w-3 h-3 fill-white" />
                    </Link>
                  ) : lesson.status === "completed" ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)]">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]">
                      <Lock className="w-3.5 h-3.5" />
                      Locked
                    </div>
                  )}
                </motion.div>
              </div>

              {/* The Central Node Icon */}
              <div className="relative shrink-0 w-16 h-16 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${
                  lesson.status === "active" ? "bg-[var(--accent)] animate-pulse" : "bg-white"
                }`} />
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-[#0A120B] z-10 ${
                  lesson.status === "active" 
                    ? "border-[var(--accent)] text-[var(--accent)] shadow-[0_0_20px_rgba(76,187,23,0.3)]" 
                    : lesson.status === "completed"
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border-color)] text-[var(--muted)]"
                }`}>
                  {lesson.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : lesson.type === "project" ? (
                    <Award className="w-6 h-6" />
                  ) : (
                    <BookOpen className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Spacer for zig-zag */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bonus Area */}
      <div className="mt-20 glass-strong p-8 rounded-3xl border border-dashed border-[var(--border-color)] text-center">
        <Star className="w-10 h-10 text-amber-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Track Graduation</h3>
        <p className="text-[var(--muted)] text-sm max-w-md mx-auto mb-6">
          Complete all {data.lessons.length} lessons to unlock the <span className="text-white font-bold">{data.title} Certification</span> and your exclusive LinkedIn badge.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          Powered by Innov8Edge AI
        </div>
      </div>

      {/* Reset Progress */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-xs text-[var(--muted)]">Want to start this track over?</p>
        <button
          onClick={handleReset}
          disabled={isResetting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
            resetConfirm
              ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
              : "bg-white/5 text-[var(--muted)] hover:text-white hover:bg-white/10 border-white/10"
          }`}
        >
          {isResetting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : resetConfirm ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <RotateCcw className="w-4 h-4" />
          )}
          {isResetting ? "Resetting..." : resetConfirm ? "Tap again to confirm reset" : "Reset Track Progress"}
        </button>
      </div>
    </div>
  );
}

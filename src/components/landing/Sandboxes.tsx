"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Workflow,
  Shield,
  BrainCircuit,
  ArrowRight,
  Zap,
  Bot,
  Wrench,
  Lightbulb,
  Network,
  Play,
  CheckCircle2,
  Search,
  MessageSquare,
  Database,
  Info,
  Globe,
  MessageCircle,
  GitBranch,
  Server,
  RotateCcw,
} from "lucide-react";

const sandboxes = [
  {
    id: "prompt",
    icon: Zap,
    label: "Prompt Playground",
    color: "#D4A843",
    description: "Type your own prompt below. See how GPT-4o, Claude, and Gemini analyze it and provide real-time metrics.",
    visual: (isDemoRunning: boolean, setIsDemoRunning: any, input: string, setInput: any, result: any, setResult: any) => (
      <div className="p-6 space-y-6">
        <div className="glass-strong rounded-xl p-4 border border-white/10 bg-black/20 focus-within:border-[var(--accent)]/50 transition-all">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-[var(--muted)] mb-2 uppercase tracking-widest">Your Test Prompt:</div>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Write a python script to scrape news..."
              className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-white/20 resize-none h-16 scrollbar-hide font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[
              { name: "GPT-4o", delay: 0 },
              { name: "Claude 3.5", delay: 0.4 },
              { name: "Gemini Pro", delay: 0.8 }
            ].map((m) => (
              <div 
                key={m.name} 
                className={`flex items-center gap-1.5 badge text-[9px] py-0.5 px-2 transition-all ${
                  isDemoRunning ? "ring-1 ring-[var(--accent)]/30" : "!bg-white/5"
                }`}
              >
                {isDemoRunning ? (
                  <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: m.delay }}
                    className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" 
                  />
                ) : result ? (
                  <CheckCircle2 className="w-2.5 h-2.5 text-[var(--accent)]" />
                ) : null}
                {m.name}
              </div>
            ))}
          </div>
          {!isDemoRunning && (
            <button 
              onClick={() => setIsDemoRunning(true)}
              className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest flex items-center gap-1 hover:brightness-125 transition-all"
            >
              <Play className="w-3 h-3 fill-[var(--accent)]" />
              Analyze Across Models
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Tokens", value: result?.tokens || 0, color: "text-[var(--primary-light)]", suffix: "" },
            { label: "Latency", value: result?.latency || "0", color: "text-[var(--accent)]", suffix: "s" },
            { label: "Cost", value: result?.cost || "0.000", color: "text-[#D4A843]", prefix: "$" },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--surface)] rounded-lg p-3 border border-white/5 text-center relative overflow-hidden">
              <div className={`text-lg font-bold ${s.color} relative z-10`}>
                <motion.span
                  key={s.value}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {s.prefix}{s.value}{s.suffix}
                </motion.span>
              </div>
              <div className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-tighter">{s.label}</div>
              {isDemoRunning && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {result && !isDemoRunning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/20 text-[10px] text-white/90 font-mono leading-relaxed relative"
            >
              <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                <CheckCircle2 className="w-3 h-3 text-[var(--accent)]" />
                <span className="text-[9px] font-bold text-[var(--accent)] uppercase">Multi-Model Cross Analysis</span>
              </div>
              <div className="space-y-3 pt-1">
                <p>{result.text}</p>
                <div className="flex gap-4 border-t border-white/5 pt-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-[var(--muted)] uppercase">Best Speed</span>
                    <span className="text-[9px] font-bold text-emerald-400">Gemini Pro</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-[var(--muted)] uppercase">Best Reasoning</span>
                    <span className="text-[9px] font-bold text-amber-400">Claude 3.5</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-[var(--muted)] uppercase">Best Value</span>
                    <span className="text-[9px] font-bold text-blue-400">GPT-4o</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ),
  },
  {
    id: "workflow",
    icon: Workflow,
    label: "Workflow Builder",
    color: "#4CBB17",
    description: "Choose a template below and watch how AI orchestrates multiple steps to solve a complex task automatically.",
    visual: (isDemoRunning: boolean, setIsDemoRunning: any, template: string | undefined, setTemplate: any, workflowInput: string | undefined, setWorkflowInput: any, workflowStep: number | undefined, setWorkflowStep: any) => {
      const _workflowInput = workflowInput ?? "";
      const _workflowStep = workflowStep ?? -1;
      const steps = [
        { 
          id: "input", 
          label: "Input Ingestion", 
          icon: Zap, 
          color: "text-blue-400",
          getDetail: (input: string) => ({
            label: "Detecting Intent",
            payload: `{ "raw_input": "${input}", "intent": "Task Execution", "priority": "High" }`,
            lesson: "The system first tokenizes your input and identifies the primary action (Search, Write, or Analyze)."
          })
        },
        { 
          id: "llm", 
          label: "AI Reasoning", 
          icon: Bot, 
          color: "text-purple-400",
          getDetail: (input: string) => ({
            label: "Decomposing Task",
            payload: `{ "thoughts": "User wants ${input.split(' ').slice(-1)[0]}. I need to fetch data then synthesize.", "steps": 3 }`,
            lesson: "AI 'Reasoning' isn't magic—it's the LLM breaking a vague goal into a structured plan of action."
          })
        },
        { 
          id: "tool", 
          label: "Tool Handshake", 
          icon: Wrench, 
          color: "text-amber-400",
          getDetail: (input: string) => ({
            label: "Executing API Call",
            payload: `{ "method": "GET", "endpoint": "/api/search", "params": { "q": "${input.split("'")[1] || input.split(' ').slice(-1)[0]}" } }`,
            lesson: "MCP (Model Context Protocol) allows the AI to securely send data to external tools (Google, Slack, etc.)"
          })
        },
        { 
          id: "result", 
          label: "Final Output", 
          icon: Network, 
          color: "text-pink-400",
          getDetail: (input: string) => ({
            label: "Synthesizing Result",
            payload: `{ "status": "Success", "output": "Task completed for ${input.split("'")[1] || 'request'}. Data saved." }`,
            lesson: "The final step converts raw tool outputs back into a human-readable result and saves the state."
          })
        }
      ];

      const handleStep = () => {
        if (_workflowStep < 3) setWorkflowStep((prev: number) => prev + 1);
        else setWorkflowStep(-1);
      };

      const activeData = _workflowStep >= 0 ? steps[_workflowStep].getDetail(_workflowInput) : null;

      return (
        <div className="p-6 space-y-6">
          {/* User Input Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Define Your Automation Goal
            </label>
            <div className="relative group">
              <input 
                type="text"
                value={_workflowInput}
                onChange={(e) => {
                  setWorkflowInput(e.target.value);
                  setWorkflowStep(-1);
                }}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--accent)] transition-all group-hover:border-white/20"
                placeholder="e.g. Research my competitors and Slack me a summary"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[8px] font-bold text-[var(--muted)] uppercase hidden sm:inline">Press Enter to Run</span>
                <div className="w-4 h-4 rounded border border-white/10 flex items-center justify-center text-[8px] text-[var(--muted)]">↵</div>
              </div>
            </div>
          </div>

          {/* Step Visualization */}
          <div className="flex items-center gap-4 justify-center">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div 
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                    _workflowStep >= i 
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 scale-105" 
                      : "border-white/5 bg-white/[0.02] opacity-40"
                  }`}
                >
                  <step.icon className={`w-4 h-4 ${_workflowStep >= i ? "text-[var(--accent)]" : "text-white"}`} />
                  <span className="text-[9px] font-bold text-white uppercase">{step.label}</span>
                </div>
                {i < 3 && (
                  <div className={`w-6 h-[1px] ${_workflowStep > i ? "bg-[var(--accent)]" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Deep Trace Inspector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-strong rounded-2xl border border-white/5 p-4 bg-black/60 min-h-[140px]">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest flex items-center gap-1.5">
                  <Database className="w-3 h-3" /> Intermediate Data Payload
                </span>
                {activeData && <span className="text-[8px] text-[var(--accent)] font-mono uppercase">{activeData.label}</span>}
              </div>
              <div className="font-mono text-[10px] text-white/60 leading-relaxed overflow-auto max-h-24">
                {activeData ? (
                  <motion.pre
                    key={_workflowStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {activeData.payload}
                  </motion.pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-[var(--muted)] italic opacity-30">
                    Click "Next Step" to trace execution
                  </div>
                )}
              </div>
            </div>

            <div className="glass-strong rounded-2xl border border-[var(--accent)]/10 p-4 bg-gradient-to-br from-[var(--accent)]/[0.02] to-transparent min-h-[140px]">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="w-3 h-3" /> Technical Deep Dive
                </span>
              </div>
              <div className="space-y-2">
                {activeData ? (
                  <motion.div
                    key={_workflowStep}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="text-[11px] font-bold text-white mb-1 uppercase tracking-tight">How it works:</div>
                    <p className="text-[10px] text-[var(--muted)] leading-relaxed">{activeData.lesson}</p>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center gap-2 py-4">
                    <BrainCircuit className="w-6 h-6 text-white/10" />
                    <p className="text-[9px] text-[var(--muted)] uppercase">Tracing is the best way to learn AI architecture.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-2">
            <button 
              onClick={handleStep}
              className="btn-primary !py-3 !px-10 !text-xs !rounded-full shadow-2xl shadow-[var(--accent)]/20 flex items-center gap-2 group transition-all"
            >
              {_workflowStep === -1 ? (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Start Execution Trace
                </>
              ) : _workflowStep === 3 ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Reset Simulation
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Execute: {steps[_workflowStep + 1].label}
                </>
              )}
            </button>
          </div>
        </div>
      );
    },
  },
  {
    id: "mcp",
    icon: Shield,
    label: "MCP Playground",
    color: "#D4A843",
    description: "Watch how AI discovers and calls tools. Try a custom request like 'Check my email' to see the secure context injection cycle.",
    visual: (isDemoRunning: boolean, _setRunning?: any, _a?: any, _b?: any, _c?: any, _d?: any, _e?: any, _f?: any) => (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "Google Search", icon: Globe, status: "Connected" },
            { name: "Slack", icon: MessageCircle, status: "Standby" },
            { name: "Local DB", icon: Database, status: "Connected" },
            { name: "GitHub", icon: GitBranch, status: "Lock" },
          ].map((s) => (
            <div key={s.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="p-2 rounded-lg bg-white/5 text-[var(--muted)]">
                <s.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-white truncate">{s.name}</div>
                <div className="text-[8px] text-[var(--muted)] uppercase tracking-tighter">{s.status}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-2xl border border-white/5 p-4 relative overflow-hidden">
          {isDemoRunning ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase">MCP Handshake In Progress</span>
                </div>
                <span className="text-[9px] font-mono text-[var(--muted)]">v1.2.0</span>
              </div>
              <div className="space-y-2">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-[10px] text-white/70"
                >
                  <Search className="w-3 h-3 text-purple-400" />
                  AI searching capability: <span className="text-purple-400">'fetch_calendar_events'</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="flex items-center gap-2 text-[10px] text-white/70"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  Tool found in <span className="text-amber-400">Google Calendar Server</span>. Executing...
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 }}
                  className="p-2 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[9px] text-[var(--accent)] font-mono"
                >
                  ✓ Context Injected: +240 tokens of live calendar data.
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="h-24 flex flex-col items-center justify-center text-center opacity-30">
              <Server className="w-8 h-8 mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Protocol Simulation Ready</p>
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    id: "agent",
    icon: BrainCircuit,
    label: "Agent Simulator",
    color: "#709775",
    description: "Create multi-agent systems. Watch agents think, plan, and collaborate to solve complex problems without manual oversight.",
    visual: (isDemoRunning: boolean, _setRunning?: any, _a?: any, _b?: any, _c?: any, _d?: any, _e?: any, _f?: any) => (
      <div className="p-6 space-y-6">
        <div className="relative h-32">
          {/* Agent Nodes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold text-white uppercase">Orchestrator</span>
          </div>

          <div className="absolute bottom-0 left-0 flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 transition-all ${isDemoRunning ? "ring-2 ring-purple-400/50 scale-110" : ""}`}>
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold text-white uppercase">Researcher</span>
          </div>

          <div className="absolute bottom-0 right-0 flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 transition-all ${isDemoRunning ? "ring-2 ring-emerald-400/50 scale-110" : ""}`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold text-white uppercase">Writer</span>
          </div>

          {/* Connection Lines (Animated) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <line x1="50%" y1="20" x2="15%" y2="90" stroke="white" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="20" x2="85%" y2="90" stroke="white" strokeWidth="1" strokeDasharray="4" />
            {isDemoRunning && (
              <>
                <motion.circle 
                  r="3" fill="var(--accent)"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ offsetPath: "path('M 125 20 L 40 90')" }}
                />
                <motion.circle 
                  r="3" fill="var(--accent)"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  style={{ offsetPath: "path('M 125 20 L 210 90')" }}
                />
              </>
            )}
          </svg>
        </div>

        <div className="glass-strong rounded-2xl border border-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Mission Progress</span>
            <span className="text-[10px] font-bold text-[var(--accent)] uppercase">Value: Autonomy</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Planning", val: 100, color: "bg-blue-400" },
              { label: "Researching", val: isDemoRunning ? 65 : 0, color: "bg-purple-400" },
              { label: "Drafting", val: isDemoRunning ? 20 : 0, color: "bg-emerald-400" },
            ].map(bar => (
              <div key={bar.label} className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-[var(--muted)]">
                  <span>{bar.label}</span>
                  <span>{bar.val}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.val}%` }}
                    className={`h-full ${bar.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export default function Sandboxes() {
  const [active, setActive] = useState(0);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  
  const [promptInput, setPromptInput] = useState("Explain quantum computing to a 10 year old using only food analogies");
  const [demoResult, setDemoResult] = useState<any>(null);
  const [workflowTemplate, setWorkflowTemplate] = useState("research");

  // Workflow Trace State (Lifted from visual)
  const [workflowInput, setWorkflowInput] = useState("Research CEO contact info for 'Innov8Edge'");
  const [workflowStep, setWorkflowStep] = useState(-1);

  const current = sandboxes[active];

  const handleRunDemo = () => {
    if (isDemoRunning) return;
    
    setIsDemoRunning(true);
    setDemoResult(null);

    // Simulate reactive response logic
    setTimeout(() => {
      setIsDemoRunning(false);
      
      const tokens = Math.floor(promptInput.length * 1.5) + 50;
      const latency = (Math.random() * 1.5 + 0.5).toFixed(1);
      const cost = (tokens * 0.00002).toFixed(4);
      
      let mockResponse = "I've analyzed your prompt and generated a response optimized for clarity and engagement.";
      if (promptInput.toLowerCase().includes("code")) mockResponse = "Generated optimized Python code structure with best-practice error handling.";
      if (promptInput.toLowerCase().includes("email")) mockResponse = "Drafted professional outreach with high-converting subject line suggestions.";
      
      setDemoResult({
        tokens,
        latency,
        cost,
        text: mockResponse
      });
    }, 2500);
  };

  return (
    <section id="sandboxes" className="section relative">
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
            <Zap className="w-3.5 h-3.5" />
            Interactive Sandboxes
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Learn by <span className="gradient-text-accent">Doing</span>,
            Not Just Watching
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
            Every lesson includes a live, interactive sandbox. Edit workflows, test prompts, and build agents — all in your browser.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-5xl mx-auto"
      >
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {sandboxes.map((s, i) => (
            <button
              key={s.id}
              id={`sandbox-tab-${s.id}`}
              onClick={() => {
                setActive(i);
                setIsDemoRunning(false);
                setDemoResult(null);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                active === i
                  ? "glass text-white shadow-lg"
                  : "text-[var(--muted)] hover:text-white hover:bg-white/5"
              }`}
              style={
                active === i
                  ? { borderColor: s.color, borderWidth: 1 }
                  : {}
              }
            >
              <s.icon className="w-4 h-4" style={active === i ? { color: s.color } : {}} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="gradient-border rounded-2xl overflow-hidden">
          <div className="glass rounded-2xl">
            {/* Tab toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-[var(--border-color)] gap-4">
              <div className="flex items-center gap-3">
                <current.icon className="w-5 h-5" style={{ color: current.color }} />
                <span className="font-bold text-white">{current.label}</span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Workflow Template Picker in Header */}
                {current.id === "workflow" && !isDemoRunning && (
                  <div className="flex gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
                    {[
                      { id: "research", label: "Research", icon: Search },
                      { id: "content", label: "Content", icon: MessageSquare },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setWorkflowTemplate(t.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${
                          workflowTemplate === t.id 
                            ? "bg-[var(--accent)] text-white" 
                            : "text-[var(--muted)] hover:text-white"
                        }`}
                      >
                        <t.icon className="w-3 h-3" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className="badge !bg-[rgba(76,187,23,0.1)] !border-[rgba(76,187,23,0.2)] !text-[var(--accent)]">
                  {isDemoRunning ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                      Running AI...
                    </span>
                  ) : (
                    "● Live Simulator"
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-6 pt-4">
              <p className="text-sm text-[var(--muted)]">{current.description}</p>
            </div>

            {/* Visual */}
            <div className="relative group/visual">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${current.id}-${workflowTemplate}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {current.id === "prompt" 
                    ? current.visual(isDemoRunning, handleRunDemo, promptInput, setPromptInput, demoResult, setDemoResult, undefined, undefined)
                    : current.id === "workflow"
                    ? current.visual(isDemoRunning, handleRunDemo, workflowTemplate, setWorkflowTemplate, workflowInput, setWorkflowInput, workflowStep, setWorkflowStep)
                    : current.visual(isDemoRunning, undefined, undefined, undefined, undefined, undefined, undefined, undefined)}
                </motion.div>
              </AnimatePresence>
              
              {/* Interactive Overlay Hint */}
              {current.id !== "prompt" && (
                <AnimatePresence>
                  {!isDemoRunning && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/40 group-hover/visual:bg-black/20 transition-colors flex items-center justify-center backdrop-blur-[2px] rounded-b-2xl pointer-events-auto"
                    >
                      <button 
                        onClick={handleRunDemo}
                        className="btn-primary !py-3 !px-6 !text-sm !rounded-full shadow-2xl shadow-black/50 transform hover:scale-110 transition-transform flex items-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Run {current.id === "workflow" ? (workflowTemplate === "research" ? "Research Flow" : "Content Flow") : "Simulation"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link href="/learn" className="btn-primary" id="sandbox-cta">
            Try Full Interactive Environment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

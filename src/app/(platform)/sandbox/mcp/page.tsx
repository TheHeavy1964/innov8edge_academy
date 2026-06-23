"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Search, 
  Database, 
  Mail, 
  MessageCircle, 
  GitBranch, 
  Terminal, 
  ArrowRight, 
  Zap, 
  Info,
  CheckCircle2,
  RefreshCcw,
  Plus,
  Server,
  Wrench,
  Globe,
  Lock,
  Eye,
  ChevronDown,
  ChevronUp,
  Cpu,
  Code
} from "lucide-react";

const availableServers = [
  { id: "google-search", name: "Google Search", icon: Globe, status: "Connected", tools: 3, latency: "42ms" },
  { id: "slack", name: "Slack Internal", icon: MessageCircle, status: "Connected", tools: 5, latency: "12ms" },
  { id: "github", name: "GitHub Enterprise", icon: GitBranch, status: "Standby", tools: 8, latency: "85ms" },
  { id: "local-db", name: "PostgreSQL Local", icon: Database, status: "Connected", tools: 2, latency: "2ms" },
];

const mockTrace = [
  { 
    id: 1, 
    type: "intent", 
    message: "User requested recent sales data from Q1.", 
    status: "success",
    raw: { intent: "data_retrieval", query: "sales_q1_2024", confidence: 0.98 }
  },
  { 
    id: 2, 
    type: "discovery", 
    message: "Scanning 4 MCP Servers for capability: 'query_sales'", 
    status: "processing",
    raw: { method: "discovery/list_tools", servers_checked: 4, tools_found: ["local-db:query_sales"] }
  },
  { 
    id: 3, 
    type: "call", 
    message: "Found tool in 'PostgreSQL Local'. Executing SELECT * FROM sales...", 
    status: "success",
    raw: { 
      method: "tools/call", 
      params: { name: "query_sales", arguments: { quarter: "Q1", year: 2024 } },
      response: { status: "200 OK", result: [1420500, 1560000, 1380000] }
    }
  },
  { 
    id: 4, 
    type: "context", 
    message: "Received 4.2kb of raw financial context. Injecting into model...", 
    status: "success",
    raw: { injection_method: "prompt_append", tokens_added: 844, system_priority: "high" }
  },
  { 
    id: 5, 
    type: "synthesis", 
    message: "Model synthesizing final report based on internal context.", 
    status: "success",
    raw: { model: "gpt-4o", completion_tokens: 312, finish_reason: "stop" }
  },
];

export default function MCPPlayground() {
  const [activeServer, setActiveServer] = useState(availableServers[0]);
  const [isSearching, setIsSearching] = useState(false);
  const [traceIndex, setTraceIndex] = useState(-1);
  const [userQuery, setUserQuery] = useState("Generate a report on Q1 sales trends using the local database.");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const startSimulation = () => {
    setIsSearching(true);
    setTraceIndex(-1);
    setExpandedStep(null);
  };

  useEffect(() => {
    if (isSearching) {
      const interval = setInterval(() => {
        setTraceIndex((prev) => {
          if (prev >= mockTrace.length - 1) {
            clearInterval(interval);
            setIsSearching(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isSearching]);

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden relative">
      {/* Left: Server Catalog */}
      <div className="w-80 flex flex-col gap-6 shrink-0 h-full">
        <div className="glass-strong rounded-3xl border border-[var(--border-color)] flex flex-col overflow-hidden flex-1">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-bold text-white uppercase tracking-wider">MCP Servers</span>
            <div className="flex gap-2">
              <button className="p-1.5 rounded-lg bg-white/5 text-[var(--muted)] hover:text-white">
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-3 overflow-y-auto scrollbar-hide">
            {availableServers.map((server) => (
              <button
                key={server.id}
                onClick={() => setActiveServer(server)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                  activeServer.id === server.id 
                    ? "glass-strong border-[var(--accent)]/50 shadow-lg shadow-[var(--accent)]/5" 
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                }`}
              >
                <div className={`p-2.5 rounded-xl ${activeServer.id === server.id ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-white/5 text-[var(--muted)]"}`}>
                  <server.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{server.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${server.status === "Connected" ? "bg-[var(--accent)]" : "bg-amber-500"}`} />
                    <span className="text-[10px] text-[var(--muted)] uppercase font-bold">{server.status}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-6 bg-white/[0.02] border-t border-white/5">
            <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
              <Lock className="w-3 h-3" /> Security Policy
            </div>
            <p className="text-[10px] text-[var(--muted)] leading-relaxed italic">
              "Local context remains encrypted. AI only receives tool outputs, never raw database credentials."
            </p>
          </div>
        </div>
      </div>

      {/* Center: Command Center */}
      <div className="flex-1 flex flex-col gap-6 h-full">
        {/* User Input Area */}
        <div className="glass-strong rounded-3xl border border-[var(--border-color)] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 blur-[100px] rounded-full -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
              <Terminal className="w-4 h-4 text-[var(--accent)]" />
              Tool Execution Request
            </div>
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white placeholder-white/20 focus:border-[var(--accent)]/40 outline-none transition-all resize-none h-32 scrollbar-hide font-mono"
              placeholder="Ask the AI to use a tool..."
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)] uppercase">
                  <Wrench className="w-3 h-3" /> {activeServer.tools} Tools Ready
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)] uppercase">
                  <Zap className="w-3 h-3" /> {activeServer.latency} Latency
                </div>
              </div>
              <button 
                onClick={startSimulation}
                disabled={isSearching}
                className="btn-primary !py-2.5 !px-8 !text-xs !rounded-xl shadow-lg shadow-[var(--accent)]/10"
              >
                {isSearching ? "Discovering..." : "Execute Request"}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Trace Log */}
        <div className="flex-1 glass-strong rounded-3xl border border-[var(--border-color)] flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[var(--muted)]" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Protocol Trace Log</span>
            </div>
            {isSearching && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--accent)] uppercase animate-pulse">
                <RefreshCcw className="w-3 h-3 animate-spin" />
                Live Trace
              </div>
            )}
          </div>
          
          <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-hide">
            <AnimatePresence>
              {traceIndex >= 0 && mockTrace.slice(0, traceIndex + 1).map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    step.type === "intent" ? "bg-blue-500/5 border-blue-500/10" :
                    step.type === "discovery" ? "bg-purple-500/5 border-purple-500/10" :
                    step.type === "call" ? "bg-amber-500/5 border-amber-500/10" :
                    "bg-emerald-500/5 border-emerald-500/10"
                  } ${expandedStep === i ? "ring-2 ring-[var(--accent)]/30 border-[var(--accent)]/20 shadow-xl" : ""}`}
                >
                  <div className="p-4 flex gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      step.type === "intent" ? "bg-blue-500/20 text-blue-400" :
                      step.type === "discovery" ? "bg-purple-500/20 text-purple-400" :
                      step.type === "call" ? "bg-amber-500/20 text-amber-400" :
                      "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {step.type === "intent" ? <Info className="w-4 h-4" /> :
                       step.type === "discovery" ? <Search className="w-4 h-4" /> :
                       step.type === "call" ? <Zap className="w-4 h-4" /> :
                       <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Step {i + 1}: {step.type}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-mono opacity-30">{new Date().toLocaleTimeString()}</span>
                          <button 
                            onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                            className={`p-1 rounded bg-white/5 hover:bg-white/10 transition-colors text-[var(--muted)] hover:text-white flex items-center gap-1.5`}
                          >
                            <Code className="w-3 h-3" />
                            <span className="text-[8px] font-bold uppercase">Inspect Protocol</span>
                            {expandedStep === i ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-white/90 font-medium">{step.message}</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedStep === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-black/60 border-t border-white/5 p-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="px-2 py-0.5 rounded bg-[var(--accent)]/20 text-[8px] font-bold text-[var(--accent)] uppercase tracking-widest border border-[var(--accent)]/30">
                            Inside the Protocol
                          </div>
                          <div className="h-[1px] flex-1 bg-white/5" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest">Handshake Data</div>
                            <div className="p-3 rounded-xl bg-[#0A120B] border border-white/5 font-mono text-[10px] text-blue-400 overflow-x-auto max-h-40 scrollbar-hide">
                              <pre>{JSON.stringify(step.raw, null, 2)}</pre>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            <div className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest">Protocol Stats</div>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { label: "Status", val: "200 OK", color: "text-emerald-400" },
                                { label: "Method", val: step.type === 'call' ? 'tools/call' : 'handshake/init', color: "text-blue-400" },
                                { label: "Latency", val: "14ms", color: "text-amber-400" },
                                { label: "Size", val: "1.4kb", color: "text-purple-400" },
                              ].map(stat => (
                                <div key={stat.label} className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                                  <div className="text-[7px] font-bold text-[var(--muted)] uppercase">{stat.label}</div>
                                  <div className={`text-[10px] font-bold ${stat.color}`}>{stat.val}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-1 p-2.5 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 flex items-center gap-3">
                              <Cpu className="w-4 h-4 text-[var(--accent)]" />
                              <div>
                                <div className="text-[8px] font-bold text-white uppercase tracking-wider">AI Reasoning Check</div>
                                <p className="text-[9px] text-[var(--muted)] italic">"Validating tool schema match before execution..."</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {traceIndex === -1 && !isSearching && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                <Terminal className="w-16 h-16 mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">Waiting for Instruction</p>
                <p className="text-xs mt-2">Submit a request to see the MCP handshake in real-time.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Value Recap Sidebar */}
      <div className="w-80 glass-strong rounded-3xl border border-[var(--accent)]/20 p-6 flex flex-col bg-gradient-to-b from-[rgba(76,187,23,0.05)] to-transparent shrink-0">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--accent)]" /> 
          Platform Value
        </h3>

        <div className="space-y-8">
          <div>
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase mb-3">Model Connectivity</div>
            <div className="flex flex-wrap gap-2">
              {["Context Aware", "Real-time Docs", "Secure Access", "No Hallucination"].map(tag => (
                <span key={tag} className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-white/70">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/10">
            <div className="text-[10px] font-bold text-[var(--accent)] uppercase mb-1">Key Insight</div>
            <p className="text-[11px] text-[var(--muted)] leading-relaxed">
              By using MCP, the AI connects to your **PostgreSQL Local** server directly. This provides 100% accurate data without the model needing to "guess" or "hallucinate" figures.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase">Trust Verification</div>
            {[
              { label: "Data Encryption", val: "AES-256" },
              { label: "Handshake Protocol", val: "MCP v1.2" },
              { label: "Local Isolation", val: "Active" },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] text-[var(--muted)]">{item.label}</span>
                <span className="text-[10px] font-bold text-white font-mono">{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Security Audit
          </button>
        </div>
      </div>
    </div>
  );
}

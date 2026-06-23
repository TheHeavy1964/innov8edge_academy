"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Settings, 
  Play, 
  Trash2, 
  Copy, 
  Download, 
  Plus, 
  X,
  Clock,
  Coins,
  Gauge,
  Bot,
  Cpu,
  Sparkles,
  ChevronRight,
  Maximize2,
  Minimize2,
  History,
  Eye,
  Terminal,
  Layers,
  Activity
} from "lucide-react";

const availableModels = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", color: "text-[#10a37f]", icon: Sparkles, maxTokens: 128000 },
  { id: "claude-3-5", name: "Claude 3.5 Sonnet", provider: "Anthropic", color: "text-[#d97757]", icon: Bot, maxTokens: 200000 },
  { id: "gemini-1-5", name: "Gemini 1.5 Pro", provider: "Google", color: "text-[#4285f4]", icon: Cpu, maxTokens: 1000000 },
  { id: "llama-3-1", name: "Llama 3.1 405B", provider: "Meta", color: "text-[#0668E1]", icon: Zap, maxTokens: 32000 },
];

export default function PromptPlayground() {
  const [selectedModels, setSelectedModels] = useState(["gpt-4o", "claude-3-5"]);
  const [isRunning, setIsRunning] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [showInspector, setShowInspector] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("You are a specialized AI prompt engineer. Your goal is to analyze provided text and suggest 3 high-impact optimizations for clarity and performance.");
  const [userInput, setUserInput] = useState("Help me write a professional email to a client explaining why our automation project is delayed by 2 weeks, but emphasize the quality improvements.");

  const toggleModel = (id: string) => {
    if (selectedModels.includes(id)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter(m => m !== id));
      }
    } else {
      setSelectedModels([...selectedModels, id]);
    }
  };

  const getRawPayload = (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    return JSON.stringify({
      model: model?.id,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
      temperature: 0.7,
      max_tokens: 2048,
      stream: true
    }, null, 2);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 relative">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between glass-strong p-4 rounded-2xl border border-[var(--border-color)] shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/20">
              <Zap className="w-4 h-4 fill-[var(--accent)]" />
            </div>
            <span className="font-bold text-white">Prompt Playground</span>
          </div>
          
          <div className="h-6 w-[1px] bg-[var(--border-color)]" />

          <div className="flex items-center gap-2">
            {availableModels.map((model) => (
              <button
                key={model.id}
                onClick={() => toggleModel(model.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                  selectedModels.includes(model.id)
                    ? "bg-white/10 border-white/20 text-white"
                    : "text-[var(--muted)] border-transparent hover:bg-white/5"
                }`}
              >
                <model.icon className={`w-3 h-3 ${selectedModels.includes(model.id) ? model.color : ""}`} />
                {model.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowInspector(!showInspector)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all rounded-xl border ${
              showInspector ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' : 'text-[var(--muted)] border-transparent hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            {showInspector ? 'Hide Inspector' : 'See Inside AI'}
          </button>
          <div className="h-6 w-[1px] bg-[var(--border-color)]" />
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--muted)] hover:text-white transition-colors">
            <History className="w-4 h-4" />
            History
          </button>
          <button 
            onClick={() => setIsRunning(true)}
            className="btn-primary !py-2 !px-6 !text-xs !rounded-xl shadow-lg shadow-[var(--accent)]/20"
          >
            <Play className="w-3 h-3 fill-white" />
            Run All
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left: Configuration Panel */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="glass-strong rounded-3xl border border-[var(--border-color)] flex flex-col overflow-hidden shrink-0"
            >
              <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Settings className="w-4 h-4 text-[var(--muted)]" />
                  Configuration
                </div>
                <button onClick={() => setShowConfig(false)} className="text-[var(--muted)] hover:text-white">
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* System Prompt */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">System Prompt</label>
                    <span className="text-[10px] text-[var(--muted)]">124 tokens</span>
                  </div>
                  <textarea 
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white font-mono focus:border-[var(--primary)]/40 outline-none transition-all resize-none"
                    placeholder="Role: Expert AI Researcher..."
                  />
                </div>

                {/* User Input */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">User Input</label>
                  <textarea 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white font-mono focus:border-[var(--primary)]/40 outline-none transition-all resize-none"
                    placeholder="Enter your message here..."
                  />
                </div>

                {/* Parameters */}
                <div className="space-y-6 pt-4 border-t border-[var(--border-color)]">
                  {[
                    { label: "Temperature", val: 0.7, min: 0, max: 2, step: 0.1 },
                    { label: "Top P", val: 1.0, min: 0, max: 1, step: 0.05 },
                    { label: "Max Tokens", val: 2048, min: 256, max: 4096, step: 128 },
                  ].map((param) => (
                    <div key={param.label} className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-[var(--muted)]">{param.label}</span>
                        <span className="text-xs font-bold text-white">{param.val}</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                        <div 
                          className="absolute h-full bg-[var(--accent)]" 
                          style={{ width: `${(param.val - param.min) / (param.max - param.min) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showConfig && (
          <button 
            onClick={() => setShowConfig(true)}
            className="w-10 glass-strong rounded-3xl border border-[var(--border-color)] flex flex-col items-center py-6 gap-6 text-[var(--muted)] hover:text-white shrink-0"
          >
            <Settings className="w-4 h-4" />
            <div className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold uppercase tracking-widest">Configuration</div>
          </button>
        )}

        {/* Right: Results Grid */}
        <div className={`flex-1 grid gap-6 ${selectedModels.length === 1 ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'} overflow-y-auto pr-2 scrollbar-hide`}>
          {selectedModels.map((modelId) => {
            const model = availableModels.find(m => m.id === modelId)!;
            return (
              <motion.div
                layout
                key={modelId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-3xl border border-[var(--border-color)] flex flex-col overflow-hidden relative group h-fit min-h-[500px]"
              >
                {/* Card Header */}
                <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <model.icon className={`w-5 h-5 ${model.color}`} />
                    <div>
                      <h3 className="text-sm font-bold text-white">{model.name}</h3>
                      <p className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider">{model.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-[var(--muted)] hover:text-white rounded-lg hover:bg-white/5">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => toggleModel(modelId)} className="p-2 text-[var(--muted)] hover:text-red-400 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Response Content */}
                <div className="flex-1 p-6">
                  <div className="space-y-4">
                    {isRunning ? (
                      <div className="prose prose-invert max-w-none text-sm text-white/90 leading-relaxed font-mono">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="relative"
                        >
                          <div className="mb-4 flex items-center gap-2 text-[var(--accent)]">
                            <Activity className="w-3 h-3 animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Generating Tokens...</span>
                          </div>
                          
                          <p>
                            Subject: Update on [Project Name] Automation Phase<br/><br/>
                            Dear [Client Name],<br/><br/>
                            I'm writing to provide a detailed update on the status of our automation integration. After conducting extensive reliability tests on the core agent architecture, we've identified several critical areas where we can significantly enhance the system's reasoning capabilities...
                          </p>

                          {/* Probability Pulse Overlay (Visualizing "Inside the AI") */}
                          {showInspector && (
                            <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 overflow-hidden">
                              <div className="flex items-center gap-2 mb-3">
                                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[10px] font-bold text-white uppercase">Token Probability Map</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {["After", "conducting", "extensive", "reliability", "tests"].map((word, i) => (
                                  <div key={i} className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 flex items-center gap-1">
                                    {word} <span className="text-[7px] text-white/40">98.4%</span>
                                  </div>
                                ))}
                                <div className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-400 flex items-center gap-1">
                                  identified <span className="text-[7px] text-white/40">64.2%</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-30">
                        <Play className="w-12 h-12 mb-4 text-[var(--muted)]" />
                        <p className="text-sm font-medium text-[var(--muted)]">Ready to test. Click 'Run' to see results.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics Footer */}
                <div className="px-6 py-4 border-t border-[var(--border-color)] bg-white/[0.02] grid grid-cols-3 gap-4">
                  {[
                    { icon: Clock, label: "Latency", value: "1.2s", color: "text-amber-400" },
                    { icon: Coins, label: "Tokens", value: "342", color: "text-emerald-400" },
                    { icon: Gauge, label: "Cost", value: "$0.005", color: "text-blue-400" },
                  ].map((metric) => (
                    <div key={metric.label} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter">
                        <metric.icon className={`w-3 h-3 ${metric.color}`} />
                        {metric.label}
                      </div>
                      <div className="text-sm font-bold text-white">{metric.value}</div>
                    </div>
                  ))}
                </div>

                {/* Inline Inspector Layer */}
                <AnimatePresence>
                  {showInspector && (
                    <motion.div 
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="absolute inset-0 z-50 glass-strong bg-[#0A120B]/95 flex flex-col border-l border-white/10"
                    >
                      <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-[var(--accent)]" />
                          <span className="text-sm font-bold text-white uppercase tracking-wider">Context Inspector</span>
                        </div>
                        <button onClick={() => setShowInspector(false)} className="p-2 rounded-lg hover:bg-white/5 text-[var(--muted)] hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                        {/* Token Distribution */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Token Distribution</span>
                            <span className="text-[10px] text-[var(--muted)]">466 / {model.maxTokens.toLocaleString()} total</span>
                          </div>
                          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden flex">
                            <div className="h-full bg-blue-500 w-[20%]" title="System" />
                            <div className="h-full bg-[var(--accent)] w-[40%]" title="User" />
                            <div className="h-full bg-amber-500 w-[10%]" title="History" />
                            <div className="h-full bg-white/5 flex-1" title="Remaining" />
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="text-[9px] font-bold text-[var(--muted)] uppercase">System: 124</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                              <span className="text-[9px] font-bold text-[var(--muted)] uppercase">User: 342</span>
                            </div>
                          </div>
                        </div>

                        {/* Raw JSON Trace */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Raw API Payload</span>
                          </div>
                          <div className="p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-[10px] text-blue-400 overflow-x-auto">
                            <pre>{getRawPayload(modelId)}</pre>
                          </div>
                        </div>

                        {/* Platform Injectors */}
                        <div className="p-4 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Hidden System Injectors</span>
                          </div>
                          <p className="text-[10px] text-[var(--muted)] leading-relaxed italic">
                            "Adhere to the platform design tokens. Ensure all responses are formatted as valid Markdown with clear section headers..."
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          
          {selectedModels.length < 4 && (
            <button 
              onClick={() => toggleModel(availableModels.find(m => !selectedModels.includes(m.id))!.id)}
              className="border-2 border-dashed border-[var(--border-color)] rounded-3xl flex flex-col items-center justify-center gap-4 text-[var(--muted)] hover:text-white hover:border-[var(--primary)]/30 transition-all hover:bg-white/[0.02] min-h-[500px]"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[var(--border-color)] flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">Add Model to Compare</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Handle, Position } from "reactflow";
import { 
  Bot, 
  Search, 
  Database, 
  Zap, 
  Lightbulb, 
  Play, 
  CheckCircle2,
  Clock,
  MessageSquare,
  Wrench,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const NodeContainer = ({ children, title, icon: Icon, color, status }: any) => (
  <div className="glass-strong rounded-2xl border border-white/10 min-w-[240px] shadow-2xl overflow-hidden">
    {/* Header */}
    <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <span className="text-xs font-bold text-white uppercase tracking-wider">{title}</span>
      </div>
      {status && (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
          <span className="text-[9px] font-bold text-[var(--muted)] uppercase">{status}</span>
        </div>
      )}
    </div>

    {/* Body */}
    <div className="p-4">
      {children}
    </div>

    {/* Status Footer (Value indicator) */}
    <div className="px-4 py-2 bg-white/[0.03] border-t border-white/5 flex items-center justify-between text-[10px]">
      <div className="flex items-center gap-1 text-[var(--muted)]">
        <Clock className="w-3 h-3" />
        0.8s
      </div>
      <div className="font-bold text-[var(--accent)] flex items-center gap-1">
        VALUE <ChevronRight className="w-2.5 h-2.5" />
      </div>
    </div>
  </div>
);

export const LLMNode = ({ data }: any) => (
  <NodeContainer title="AI Inference" icon={Bot} color="#A1CCA5" status={data.status}>
    <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[var(--accent)] !border-none" />
    <div className="space-y-3">
      <div className="text-[10px] font-bold text-[var(--muted)] uppercase">Model Selection</div>
      <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-white flex items-center gap-2">
        <Zap className="w-3 h-3 text-amber-400" />
        GPT-4o Mini
      </div>
      <div className="text-[10px] text-[var(--muted)] leading-relaxed italic">
        "Summarize lead data and predict purchase intent..."
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[var(--accent)] !border-none" />
  </NodeContainer>
);

export const ToolNode = ({ data }: any) => (
  <NodeContainer title="External Tool" icon={Wrench} color="#D4A843" status={data.status}>
    <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[var(--accent)] !border-none" />
    <div className="space-y-3">
      <div className="text-[10px] font-bold text-[var(--muted)] uppercase">API Endpoint</div>
      <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-white flex items-center gap-2">
        <Search className="w-3 h-3 text-blue-400" />
        Google Search API
      </div>
      <div className="flex items-center gap-2 text-[10px] text-[var(--accent)] font-bold">
        <CheckCircle2 className="w-3 h-3" />
        Authentication Valid
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[var(--accent)] !border-none" />
  </NodeContainer>
);

export const StartNode = () => (
  <div className="glass-strong rounded-full px-6 py-3 border border-[var(--accent)]/30 shadow-[0_0_30px_rgba(76,187,23,0.1)] flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shadow-lg">
      <Play className="w-4 h-4 fill-white" />
    </div>
    <div>
      <div className="text-xs font-bold text-white uppercase tracking-widest">Workflow Start</div>
      <div className="text-[10px] text-[var(--muted)]">Trigger: Webhook Receive</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-[var(--accent)] !border-none" />
  </div>
);

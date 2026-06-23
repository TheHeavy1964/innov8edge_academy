"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { 
  Bot, 
  Search, 
  MessageSquare, 
  BrainCircuit, 
  Play, 
  RotateCcw, 
  Plus, 
  Settings2, 
  Zap, 
  Shield, 
  Network,
  ChevronRight,
  Target,
  Sparkles,
  Layers,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Trash2,
  Share2
} from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { useAuth } from '@/context/AuthContext';
import { supabase, isConfigured } from '@/lib/supabase';

// --- Types ---

type AgentRole = 'orchestrator' | 'researcher' | 'analyst' | 'writer';

interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  model: string;
  status: 'idle' | 'thinking' | 'working' | 'done' | 'error';
  color: string;
}

interface Step {
  id: string;
  agentId: string;
  thought: string;
  action: string;
  output: string;
  timestamp: string;
}

// --- Initial Data ---

const initialAgents: Agent[] = [
  { id: '1', name: 'Commander-X', role: 'orchestrator', model: 'GPT-4o', status: 'idle', color: '#3B82F6' },
  { id: '2', name: 'Seeker-7', role: 'researcher', model: 'Claude 3.5 Sonnet', status: 'idle', color: '#A855F7' },
  { id: '3', name: 'Insight-0', role: 'analyst', model: 'Gemini 1.5 Pro', status: 'idle', color: '#10B981' },
  { id: '4', name: 'Scribe-V', role: 'writer', model: 'GPT-4o Mini', status: 'idle', color: '#EC4899' },
];

// --- Components ---

const AgentBadge = ({ role }: { role: AgentRole }) => {
  const configs = {
    orchestrator: { icon: Target, label: 'Orchestrator', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    researcher: { icon: Search, label: 'Researcher', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    analyst: { icon: BrainCircuit, label: 'Analyst', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    writer: { icon: MessageSquare, label: 'Writer', color: 'bg-pink-500/10 text-pink-400 border-pink-400/20' },
  };
  const config = configs[role];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${config.color}`}>
      <Icon className="w-2.5 h-2.5" />
      {config.label}
    </div>
  );
};

export default function AgentSimulator() {
  const { elih } = usePlatform();
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [mission, setMission] = useState('Create a comprehensive competitive analysis of the AI tutoring market in 2024.');
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState({ title: '', description: '' });
  const [isSharing, setIsSharing] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // Form States for Modal
  const [formData, setFormData] = useState({
    name: '',
    role: 'researcher' as AgentRole,
    model: 'GPT-4o (Reasoning)',
    color: '#3B82F6'
  });

  const searchParams = useSearchParams();
  const remixId = searchParams.get('remix');

  // Load saved agents or remix on mount
  useEffect(() => {
    async function loadAgents() {
      if (!user || !isConfigured) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // 1. Check for Remix First
      if (remixId) {
        const { data: marketplaceItem, error: remixError } = await supabase
          .from('marketplace_listings')
          .select('content')
          .eq('id', remixId)
          .single();

        if (!remixError && marketplaceItem) {
          const { agents: remixedAgents, mission: remixedMission } = marketplaceItem.content;
          setAgents(remixedAgents || initialAgents);
          if (remixedMission) setMission(remixedMission);
          
          // Auto-save the remix to user's personal sandbox_states
          saveAgents(remixedAgents || initialAgents);
          setLoading(false);
          return;
        }
      }

      // 2. Default to Personal State
      const { data, error } = await supabase
        .from('sandbox_states')
        .select('state_json')
        .eq('user_id', user.id)
        .eq('sandbox_type', 'agent')
        .maybeSingle();

      if (!error && data) {
        setAgents(data.state_json.agents || initialAgents);
      }
      setLoading(false);
    }

    loadAgents();
  }, [user, remixId]);

  // Sync Form Data when editing starts
  useEffect(() => {
    if (editingAgent) {
      setFormData({
        name: editingAgent.name,
        role: editingAgent.role,
        model: editingAgent.model,
        color: editingAgent.color
      });
    } else if (showDraftModal) {
      setFormData({
        name: '',
        role: 'researcher',
        model: 'GPT-4o (Reasoning)',
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      });
    }
  }, [editingAgent, showDraftModal]);

  // Save agents to Supabase
  const saveAgents = async (updatedAgents: Agent[]) => {
    if (!user || !isConfigured) return;

    try {
      await supabase
        .from('sandbox_states')
        .upsert({
          user_id: user.id,
          sandbox_type: 'agent',
          state_json: { agents: updatedAgents },
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,sandbox_type' });
    } catch (e) {
      console.error("Failed to sync with Supabase:", e);
    }
  };

  const simulationSteps: Partial<Step>[] = [
    // ... (existing simulation steps)
  ];

  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSteps([]);
    setCurrentStep(0);
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));

    let stepIdx = 0;
    const interval = setInterval(() => {
      // ... (existing interval logic)
    }, 3000);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSteps([]);
    setCurrentStep(0);
    setActiveAgentId(null);
    setAgents(initialAgents);
    saveAgents(initialAgents);
  };

  const deleteAgent = (id: string) => {
    const updated = agents.filter(a => a.id !== id);
    setAgents(updated);
    saveAgents(updated);
  };

  const addAgent = (newAgent: Agent) => {
    const updated = [...agents, newAgent];
    setAgents(updated);
    saveAgents(updated);
  };

  const updateAgent = (updatedAgent: Agent) => {
    const updated = agents.map(a => a.id === updatedAgent.id ? updatedAgent : a);
    setAgents(updated);
    saveAgents(updated);
  };

  const handleShare = async () => {
    if (!user || !isConfigured || !shareData.title) return;
    setIsSharing(true);

    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .insert({
          user_id: user.id,
          title: shareData.title,
          description: shareData.description,
          type: 'agent_squad',
          content: { agents, mission },
          tags: agents.map(a => a.role),
          status: 'pending',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400'
        });

      if (error) throw error;
      
      setShowShareModal(false);
      setShareData({ title: '', description: '' });
      alert("Success! Your squad has been published to the marketplace.");
    } catch (e) {
      console.error("Failed to share:", e);
      alert("Failed to publish squad. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 overflow-hidden">
      {/* Top Bar: Mission Configuration */}
      <div className="glass-strong rounded-3xl border border-white/5 p-6 shrink-0">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Active Mission Objective</span>
            </div>
            <div className="relative group">
              <input 
                type="text"
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                disabled={isSimulating}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition-all group-hover:border-white/20 disabled:opacity-50"
                placeholder="Describe what your agent squad should do..."
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent)] animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={resetSimulation}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[var(--muted)] hover:text-white hover:bg-white/10 transition-all"
              title="Reset Simulation"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all"
              title="Share to Marketplace"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={startSimulation}
              disabled={isSimulating || !mission}
              className="btn-primary !py-4 !px-8 flex items-center gap-3 shadow-xl shadow-[var(--accent)]/20 disabled:opacity-50 disabled:grayscale"
            >
              {isSimulating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Initiate Mission
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Panel: The Bureau (Agent List) */}
        <div className="w-80 shrink-0 flex flex-col gap-6 h-full">
          <div className="glass-strong rounded-3xl border border-white/5 flex flex-col overflow-hidden h-full">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Agent Bureau</span>
              </div>
              <button 
                onClick={() => setShowDraftModal(true)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--muted)] hover:text-white transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {agents.map((agent) => (
                <motion.div 
                  key={agent.id}
                  layout
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                    activeAgentId === agent.id 
                      ? "border-[var(--accent)] bg-[var(--accent)]/5 ring-1 ring-[var(--accent)]/20" 
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative ${
                        agent.status === 'thinking' ? 'animate-pulse' : ''
                      }`} style={{ backgroundColor: `${agent.color}15`, border: `1px solid ${agent.color}30` }}>
                        <Bot className="w-5 h-5" style={{ color: agent.color }} />
                        {agent.status === 'thinking' && (
                          <div className="absolute inset-0 rounded-xl border-2 border-[var(--accent)] animate-ping opacity-40" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{agent.name}</div>
                        <div className="text-[10px] text-[var(--muted)]">{agent.model}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setEditingAgent(agent)}
                      className="text-[var(--muted)] hover:text-white transition-all p-1 hover:bg-white/5 rounded"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <AgentBadge role={agent.role} />
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        agent.status === 'thinking' ? 'bg-[var(--accent)] animate-pulse' :
                        agent.status === 'done' ? 'bg-emerald-400' : 'bg-white/20'
                      }`} />
                      <span className="text-[9px] font-bold text-[var(--muted)] uppercase">{agent.status}</span>
                    </div>
                  </div>

                  {activeAgentId === agent.id && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-[var(--accent)]"
                    />
                  )}
                </motion.div>
              ))}
              
              {agents.length === 0 && (
                <div className="text-center py-10 opacity-30">
                  <Bot className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-[10px] uppercase font-bold">No agents drafted</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase">System Resource</span>
                <span className="text-[10px] font-bold text-white">{isSimulating ? '85%' : '40%'}</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: isSimulating ? '85%' : '40%' }}
                  className={`h-full ${isSimulating ? 'bg-amber-400' : 'bg-blue-500'} transition-colors duration-500`} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas: Simulation & Reasoning Tree */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="flex-1 glass-strong rounded-3xl border border-white/5 relative overflow-hidden flex flex-col">
            {/* Canvas Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-[var(--accent)] animate-pulse' : 'bg-white/20'}`} />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Collaborative Reasoning Tree</span>
              </div>
              <div className="flex gap-2">
                <div className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-[var(--muted)] uppercase">
                  Steps: {currentStep} / {simulationSteps.length}
                </div>
              </div>
            </div>

            {/* Simulation Canvas */}
            <div className="flex-1 relative overflow-y-auto bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.03)_1px,transparent_0)] [background-size:24px_24px] p-8 scrollbar-hide">
              <AnimatePresence>
                {steps.map((step, idx) => {
                  const agent = agents.find(a => a.id === step.agentId)!;
                  const isLast = idx === steps.length - 1;
                  
                  if (!agent) return null;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`mb-6 max-w-xl ${idx % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-1`} style={{ backgroundColor: `${agent.color}20`, border: `1px solid ${agent.color}40` }}>
                          <Bot className="w-4 h-4" style={{ color: agent.color }} />
                        </div>
                        <div className={`flex-1 p-4 rounded-2xl border ${
                          isLast ? 'border-[var(--accent)]/30 bg-[var(--accent)]/[0.03]' : 'border-white/5 bg-white/[0.02]'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{agent.name} • {step.action}</span>
                            <span className="text-[9px] text-[var(--muted)] font-mono">{step.timestamp}</span>
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed mb-3 italic">
                            "{step.thought}"
                          </p>
                          <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] text-[var(--accent)]">
                            <div className="flex items-center gap-1.5 mb-1 text-[var(--muted)] uppercase font-bold">
                              <Terminal className="w-3 h-3" /> Output Payload:
                            </div>
                            {step.output}
                          </div>
                        </div>
                      </div>
                      
                      {/* Connection Line to next step */}
                      {idx < steps.length - 1 && (
                        <div className={`h-8 w-[1px] bg-gradient-to-b from-white/10 to-transparent my-1 ${idx % 2 === 0 ? 'ml-4' : 'mr-4 ml-auto'}`} />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {!isSimulating && steps.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <Network className="w-10 h-10 text-[var(--muted)]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Simulation Ready</h3>
                  <p className="text-sm text-[var(--muted)] max-w-xs mx-auto">
                    Configure your mission and initiate the simulation to watch your agents collaborate in real-time.
                  </p>
                </div>
              )}
              
              {/* Floating scroll bottom hint */}
              {steps.length > 2 && (
                <div className="sticky bottom-0 left-1/2 -translate-x-1/2 pb-4 pointer-events-none">
                  <div className="px-3 py-1.5 rounded-full glass border border-white/10 text-[9px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Auto-scrolling trace...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audit Log / Trace Panel */}
          <div className="h-64 glass-strong rounded-3xl border border-white/5 flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">High-Fidelity Execution Trace</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
                  <span className="text-[9px] font-bold text-[var(--muted)] uppercase">Real-time</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-2 scrollbar-hide bg-black/40">
              {steps.length === 0 ? (
                <div className="text-white/20 italic">Waiting for simulation start...</div>
              ) : (
                steps.map((step, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-white/40">[{step.timestamp}] <span className="text-blue-400">INFO</span> - Agent <span className="text-white">'{agents.find(a => a.id === step.agentId)?.name}'</span> initiated <span className="text-[var(--accent)]">[{step.action}]</span></div>
                    <div className="pl-4 text-white/60 border-l border-white/10 ml-2 py-1">
                      {`> Executing reasoning loop...`}
                      <br />
                      {`> Result: ${step.output.substring(0, 80)}...`}
                    </div>
                  </div>
                ))
              )}
              {isSimulating && (
                <div className="flex items-center gap-2 text-[var(--accent)] animate-pulse">
                  <span>_</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">Processing next agentic inference...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Value & Architecture */}
        <div className="w-72 shrink-0 flex flex-col gap-6">
          <div className="glass-strong rounded-3xl border border-[var(--accent)]/20 p-6 bg-gradient-to-b from-[rgba(76,187,23,0.05)] to-transparent">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-4 h-4 text-[var(--accent)]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Agentic ROI</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] font-bold text-[var(--muted)] uppercase mb-1">Autonomous Accuracy</div>
                <div className="text-3xl font-black text-white">92<span className="text-sm font-bold ml-1 text-[var(--accent)]">%</span></div>
                <div className="mt-2 text-[10px] text-[var(--muted)] leading-tight">
                  Compared to 65% for single-prompt attempts at this complexity.
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--muted)] uppercase font-bold">Inference Cost</span>
                  <span className="text-white">$0.12 / mission</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[60%] h-full bg-amber-400 rounded-full" />
                </div>
                
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--muted)] uppercase font-bold">Latency</span>
                  <span className="text-white">~12.5s total</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-emerald-400 rounded-full" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-bold text-white uppercase">Architecture</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                    <div className="text-[8px] text-[var(--muted)] uppercase">Pattern</div>
                    <div className="text-[10px] font-bold text-white">Swarm</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                    <div className="text-[8px] text-[var(--muted)] uppercase">Memory</div>
                    <div className="text-[10px] font-bold text-white">Redis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 glass-strong rounded-3xl border border-white/5 p-6 relative overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">How it works</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
              {elih ? (
                // Simplified ELIH Content
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-tight">The Boss Agent</div>
                    <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                      One main AI acts like a project manager. It looks at your goal and makes a simple to-do list.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-tight">Passing the Baton</div>
                    <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                      The boss sends specific jobs to other "specialist" AIs so they don't get confused by the big picture.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-tight">Double-Checking</div>
                    <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                      Before finishing, another AI reads everything to make sure the facts are right and no one made mistakes.
                    </p>
                  </div>
                </div>
              ) : (
                // Technical Content
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-white uppercase tracking-tight">1. Orchestration</div>
                    <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                      The lead agent uses a "ReAct" pattern to plan steps, determining which specialist agents are needed.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-white uppercase tracking-tight">2. Task Delegation</div>
                    <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                      Sub-tasks are passed via standardized JSON schemas to keep specialized contexts pure.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-white uppercase tracking-tight">3. Synthesis</div>
                    <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                      The Analyst cross-references all outputs to ensure consistency and eliminate hallucinations.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <a 
                href="/learn/beginner/3"
                className="w-full py-3 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[11px] font-bold text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-all flex items-center justify-center gap-2 group"
              >
                Deep Dive Documentation
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(showDraftModal || editingAgent) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowDraftModal(false); setEditingAgent(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-strong rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
                    {showDraftModal ? <Plus className="w-6 h-6" /> : <Settings2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                      {showDraftModal ? 'Draft New Agent' : 'Agent Configuration'}
                    </h2>
                    <p className="text-xs text-[var(--muted)]">Configure the agent's persona and core reasoning model.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Agent Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Researcher-1"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--accent)]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Reasoning Model</label>
                      <select 
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--accent)] appearance-none"
                      >
                        <option>GPT-4o (Reasoning)</option>
                        <option>Claude 3.5 Sonnet</option>
                        <option>Gemini 1.5 Pro</option>
                        <option>Llama 3 (Local)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">System Role</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Orchestrator', 'Researcher', 'Analyst', 'Writer'].map(role => (
                        <button 
                          key={role}
                          onClick={() => setFormData(prev => ({ ...prev, role: role.toLowerCase() as AgentRole }))}
                          className={`py-2 rounded-lg border text-[9px] font-bold uppercase transition-all ${
                            (formData.role === role.toLowerCase()) 
                              ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20' 
                              : 'bg-white/5 border-white/5 text-[var(--muted)] hover:text-white hover:border-white/10'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Base Instructions</label>
                    <textarea 
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--accent)] h-24 resize-none"
                      placeholder="Define the specific behavioral guardrails for this agent..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  {editingAgent && (
                    <button 
                      onClick={() => { deleteAgent(editingAgent.id); setEditingAgent(null); }}
                      className="p-3 rounded-xl bg-red-400/5 border border-red-400/10 text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => { setShowDraftModal(false); setEditingAgent(null); }}
                    className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      const newAgentData: Agent = {
                        id: editingAgent?.id || Math.random().toString(36).substr(2, 9),
                        name: formData.name || 'New Agent',
                        role: formData.role,
                        model: formData.model,
                        status: 'idle',
                        color: formData.color
                      };

                      if (showDraftModal) {
                        addAgent(newAgentData);
                      } else {
                        updateAgent(newAgentData);
                      }
                      
                      setShowDraftModal(false);
                      setEditingAgent(null);
                    }}
                    className="flex-1 py-4 rounded-xl bg-[var(--accent)] text-white text-xs font-bold shadow-xl shadow-[var(--accent)]/20 hover:brightness-110 transition-all"
                  >
                    {showDraftModal ? 'Create Agent' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-strong rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                      Publish to Marketplace
                    </h2>
                    <p className="text-xs text-[var(--muted)]">Share your agent squad and mission with the community.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Listing Title</label>
                    <input 
                      type="text" 
                      value={shareData.title}
                      onChange={(e) => setShareData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Competitive Market Intelligence Squad"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--accent)]" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Description</label>
                    <textarea 
                      value={shareData.description}
                      onChange={(e) => setShareData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--accent)] h-24 resize-none"
                      placeholder="Explain what this squad is best at and how to use it..."
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-[var(--accent)]" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Included in share:</span>
                    </div>
                    <p className="text-[9px] text-[var(--muted)]">
                      Your current squad of {agents.length} agents and the active mission objective will be packaged into a template for others to remix.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button 
                    onClick={() => setShowShareModal(false)}
                    disabled={isSharing}
                    className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleShare}
                    disabled={isSharing || !shareData.title}
                    className="flex-1 py-4 rounded-xl bg-[var(--accent)] text-white text-xs font-bold shadow-xl shadow-[var(--accent)]/20 hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSharing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        Publish Squad
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


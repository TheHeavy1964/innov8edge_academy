"use client";

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  Connection, 
  Edge, 
  Node,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import { LLMNode, ToolNode, StartNode } from '@/components/platform/workflow/Nodes';
import { 
  Play, 
  Save, 
  Plus, 
  Share2, 
  Trash2, 
  HelpCircle,
  Database,
  Search,
  MessageSquare,
  TrendingUp,
  Clock,
  Zap,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

// Initial Nodes
const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'start', 
    position: { x: 250, y: 0 }, 
    data: {} 
  },
  { 
    id: '2', 
    type: 'llm', 
    position: { x: 180, y: 150 }, 
    data: { status: 'idle' } 
  },
  { 
    id: '3', 
    type: 'tool', 
    position: { x: 180, y: 380 }, 
    data: { status: 'idle' } 
  },
];

// Initial Edges
const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: true, 
    style: { stroke: '#4CBB17', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4CBB17' }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    animated: true, 
    style: { stroke: '#4CBB17', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4CBB17' }
  },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isExecuting, setIsExecuting] = useState(false);

  const nodeTypes = useMemo(() => ({
    start: StartNode,
    llm: LLMNode,
    tool: ToolNode,
  }), []);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { stroke: '#4CBB17', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#4CBB17' }
    }, eds));
  }, [setEdges]);

  const runWorkflow = () => {
    setIsExecuting(true);
    // Simulate node-by-node execution
    setNodes((nds) => nds.map(n => n.id === '2' ? { ...n, data: { status: 'running' } } : n));
    
    setTimeout(() => {
      setNodes((nds) => nds.map(n => n.id === '2' ? { ...n, data: { status: 'done' } } : n));
      setNodes((nds) => nds.map(n => n.id === '3' ? { ...n, data: { status: 'running' } } : n));
    }, 1500);

    setTimeout(() => {
      setNodes((nds) => nds.map(n => n.id === '3' ? { ...n, data: { status: 'done' } } : n));
      setIsExecuting(false);
    }, 3000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden">
      {/* Sidebar: Node Library & Value Panel */}
      <div className="w-80 flex flex-col gap-6 shrink-0 h-full">
        {/* Node Library */}
        <div className="glass-strong rounded-3xl border border-[var(--border-color)] flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Node Library</span>
            <HelpCircle className="w-4 h-4 text-[var(--muted)]" />
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-80 scrollbar-hide">
            {[
              { icon: Database, label: "Data Source", color: "text-blue-400" },
              { icon: Search, label: "Web Search", color: "text-purple-400" },
              { icon: MessageSquare, label: "Text Classifier", color: "text-emerald-400" },
              { icon: Zap, label: "API Webhook", color: "text-amber-400" },
            ].map((node) => (
              <div 
                key={node.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--primary)]/30 cursor-grab active:cursor-grabbing group transition-all"
              >
                <div className={`p-2 rounded-lg bg-white/5 ${node.color}`}>
                  <node.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white/80 group-hover:text-white">{node.label}</span>
                <Plus className="w-3.5 h-3.5 ml-auto text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Value Panel: Identifying ROI */}
        <div className="flex-1 glass-strong rounded-3xl border border-[var(--accent)]/20 p-6 flex flex-col bg-gradient-to-b from-[rgba(76,187,23,0.05)] to-transparent">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Workflow Value</h3>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase mb-1">Time Saved / Week</div>
              <div className="text-3xl font-black text-white">4.2<span className="text-sm font-bold ml-1 text-[var(--accent)]">HRS</span></div>
              <div className="mt-2 text-[10px] text-[var(--muted)] leading-tight">
                Replaces manual lead qualification and CRM entry.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[9px] font-bold text-[var(--muted)] uppercase mb-1">Cost / Run</div>
                <div className="text-sm font-bold text-white">$0.04</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[9px] font-bold text-[var(--muted)] uppercase mb-1">Accuracy</div>
                <div className="text-sm font-bold text-white">94%</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-white/10 flex items-start gap-3">
              <Info className="w-4 h-4 text-[var(--muted)] shrink-0 mt-0.5" />
              <p className="text-[10px] text-[var(--muted)] leading-relaxed italic">
                "Each 'AI Inference' step adds approx. 120ms of latency but reduces human error by 40%."
              </p>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <button 
              onClick={runWorkflow}
              disabled={isExecuting}
              className="w-full btn-primary !py-3 flex items-center justify-center gap-2 shadow-xl shadow-[var(--accent)]/10"
            >
              {isExecuting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Run Workflow
                </>
              )}
            </button>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Save className="w-3 h-3" />
                Save
              </button>
              <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Share2 className="w-3 h-3" />
                Deploy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 glass-strong rounded-3xl border border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-[#0A120B]/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/5">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Canvas</span>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:32px_32px]"
        >
          <Background color="#1A2E1D" gap={32} />
          <Controls className="!bg-[#0A120B] !border-white/10 !fill-white" />
        </ReactFlow>

        {/* Toolbar Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-[#0A120B]/80 backdrop-blur-md p-2 rounded-2xl border border-white/5 shadow-2xl">
          <button className="p-3 text-[var(--muted)] hover:text-white transition-all rounded-xl hover:bg-white/5">
            <Plus className="w-5 h-5" />
          </button>
          <div className="w-[1px] h-6 bg-white/10" />
          <button className="p-3 text-[var(--muted)] hover:text-white transition-all rounded-xl hover:bg-white/5">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-3 text-[var(--muted)] hover:text-red-400 transition-all rounded-xl hover:bg-white/5">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

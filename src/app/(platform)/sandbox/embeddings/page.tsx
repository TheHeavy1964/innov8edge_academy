"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  Search, 
  Cpu, 
  Layers, 
  Zap, 
  Target, 
  Activity,
  ChevronRight,
  Info,
  Maximize2,
  Minimize2,
  FileText,
  Network
} from "lucide-react";

const mockDocuments = [
  { id: 1, text: "The capital of France is Paris.", category: "Geography", vector: [0.8, 0.2, 0.1] },
  { id: 2, text: "Lyon is a major city in France.", category: "Geography", vector: [0.75, 0.25, 0.15] },
  { id: 3, text: "Baguettes are a popular French bread.", category: "Food", vector: [0.3, 0.8, 0.2] },
  { id: 4, text: "Croissants are buttery and flaky.", category: "Food", vector: [0.25, 0.85, 0.25] },
  { id: 5, text: "Python is a versatile programming language.", category: "Technology", vector: [0.1, 0.2, 0.9] },
  { id: 6, text: "TypeScript adds types to JavaScript.", category: "Technology", vector: [0.15, 0.15, 0.85] },
];

export default function EmbeddingExplorer() {
  const [query, setQuery] = useState("French food and snacks");
  const [selectedDoc, setSelectedDoc] = useState<(typeof mockDocuments[0] & { similarity?: number }) | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Simple simulated cosine similarity
  const searchResults = useMemo(() => {
    if (!query) return [];
    return mockDocuments
      .map(doc => ({
        ...doc,
        similarity: Math.random() * 0.4 + (doc.category === "Food" ? 0.5 : 0.1) // Simulated search logic
      }))
      .sort((a, b) => b.similarity - a.similarity);
  }, [query, isSearching]);

  const runSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 relative">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between glass-strong p-4 rounded-2xl border border-[var(--border-color)] shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <Network className="w-4 h-4" />
            </div>
            <span className="font-bold text-white">Embedding Space Explorer</span>
          </div>
          <div className="h-6 w-[1px] bg-[var(--border-color)]" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/70 uppercase">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            Vector DB: Pinecone Local
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--muted)] hover:text-white transition-colors">
            <Info className="w-4 h-4" />
            How RAG Works
          </button>
          <button 
            onClick={runSearch}
            className="btn-primary !py-2 !px-6 !text-xs !rounded-xl !bg-purple-600 hover:!bg-purple-500 shadow-lg shadow-purple-500/20"
          >
            <Search className="w-3 h-3 fill-white" />
            Search Vector Space
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left: Search & Documents */}
        <div className="w-96 flex flex-col gap-6 shrink-0 h-full">
          {/* Query Input */}
          <div className="glass-strong rounded-3xl border border-[var(--border-color)] p-6 flex flex-col gap-4">
            <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Natural Language Query</label>
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-purple-500/40 outline-none transition-all"
              placeholder="e.g. Tell me about French cuisine..."
            />
          </div>

          {/* Result List */}
          <div className="flex-1 glass-strong rounded-3xl border border-[var(--border-color)] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-white/5 text-[10px] font-bold text-white uppercase tracking-widest bg-black/20">
              Top Ranked Chunks (Semantic Search)
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {searchResults.map((doc, i) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full p-4 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                    selectedDoc?.id === doc.id 
                      ? "bg-purple-500/10 border-purple-500/50 shadow-lg" 
                      : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                      doc.category === "Geography" ? "bg-blue-500/20 text-blue-400" :
                      doc.category === "Food" ? "bg-amber-500/20 text-amber-400" :
                      "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {doc.category}
                    </span>
                    <span className="text-[9px] font-mono text-purple-400 font-bold">{(doc.similarity * 100).toFixed(1)}% match</span>
                  </div>
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">{doc.text}</p>
                  
                  {/* Similarity Progress Bar */}
                  <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${doc.similarity * 100}%` }}
                      className="h-full bg-purple-500"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Vector Space Visualization */}
        <div className="flex-1 glass-strong rounded-3xl border border-[var(--border-color)] relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_70%)] pointer-events-none" />
          
          <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">3D Vector Visualization</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-[10px] text-[var(--muted)] font-bold uppercase">Mapping Space...</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center p-12">
            {/* Simulated 3D Space Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            {/* Visualizing Vector Points */}
            <div className="relative w-full h-full max-w-2xl max-h-2xl">
              {mockDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: (doc.vector[0] * 400) - 200,
                    y: (doc.vector[1] * 400) - 200,
                    z: doc.vector[2] * 100
                  }}
                  whileHover={{ scale: 1.5, zIndex: 10 }}
                  onClick={() => setSelectedDoc(doc)}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer flex items-center justify-center border-2 transition-colors ${
                    selectedDoc?.id === doc.id ? "bg-purple-500 border-white shadow-[0_0_20px_rgba(168,85,247,0.5)]" : "bg-white/10 border-white/20 hover:border-purple-400"
                  }`}
                >
                  <div className="absolute -bottom-6 text-[8px] font-bold text-[var(--muted)] whitespace-nowrap opacity-0 group-hover:opacity-100 uppercase tracking-widest">
                    Chunk #{doc.id}
                  </div>
                </motion.div>
              ))}

              {/* Search Vector (The "Target") */}
              <AnimatePresence>
                {!isSearching && (
                  <motion.div
                    initial={{ opacity: 0, scale: 2 }}
                    animate={{ opacity: 1, scale: 1, x: 20, y: 80 }}
                    className="absolute w-6 h-6 border-2 border-dashed border-purple-400 rounded-full flex items-center justify-center"
                  >
                    <Target className="w-3 h-3 text-purple-400" />
                    <div className="absolute -top-8 text-[9px] font-bold text-purple-400 whitespace-nowrap uppercase tracking-widest bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20">
                      Query Vector
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Connecting Lines (Simulated Clusters) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <line x1="50%" y1="50%" x2="40%" y2="40%" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4" />
                <line x1="50%" y1="50%" x2="60%" y2="55%" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4" />
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-[10px] text-[var(--muted)] font-bold uppercase">Geography</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-[10px] text-[var(--muted)] font-bold uppercase">Food</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-[var(--muted)] font-bold uppercase">Technology</span>
            </div>
          </div>
        </div>

        {/* Right: Technical Details */}
        <div className="w-80 flex flex-col gap-6 shrink-0 h-full">
          <div className="glass-strong rounded-3xl border border-[var(--border-color)] p-6 flex flex-col flex-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" /> 
              Vector Logic
            </h3>

            <div className="space-y-8 flex-1">
              {selectedDoc ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                    <div className="text-[10px] font-bold text-purple-400 uppercase mb-2">Raw Text</div>
                    <p className="text-xs text-white/90 leading-relaxed font-medium italic">"{selectedDoc.text}"</p>
                  </div>

                  <div className="space-y-3">
                    <div className="text-[10px] font-bold text-[var(--muted)] uppercase">Calculated Embedding</div>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedDoc.vector.map((val, i) => (
                        <div key={i} className="p-2 rounded-lg bg-black/40 border border-white/5 flex flex-col items-center">
                          <span className="text-[8px] text-white/40 mb-1">D{i+1}</span>
                          <span className="text-[10px] font-bold text-purple-400 font-mono">{val.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-[10px] font-bold text-[var(--muted)] uppercase">Distance Metric</div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[var(--muted)]">Cosine Similarity</span>
                        <span className="text-emerald-400 font-bold">{((selectedDoc.similarity ?? 0) * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[var(--muted)]">Euclidean Dist.</span>
                        <span className="text-white font-bold">0.24</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                  <Target className="w-12 h-12 mb-4" />
                  <p className="text-xs font-bold uppercase">Select a point to inspect</p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">The "Magic"</span>
                </div>
                <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                  Notice how "Baguettes" and "Croissants" are physically closer together? The AI understands they are **semantically related** food items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

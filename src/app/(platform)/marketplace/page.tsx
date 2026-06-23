"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Zap, 
  Star, 
  Download, 
  Eye, 
  Share2, 
  Bot, 
  BrainCircuit, 
  Terminal,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Users
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase, isConfigured } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Check, X as Close, ShieldCheck, ShieldAlert, Clock as ClockIcon } from "lucide-react";

const categories = ["All", "Agent Squads", "Prompt Templates", "Workflows", "MCP Tools"];

const marketplaceItems = [
  {
    id: 1,
    title: "Market Researcher Pro",
    type: "Agent Squad",
    description: "A 3-agent squad designed to scrape, analyze, and summarize market trends for any industry.",
    author: "Derrick Martin",
    authorImage: "/avatar.png",
    stars: 124,
    downloads: "1.2k",
    category: "Agent Squads",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
    tags: ["Research", "GPT-4o", "Web Scraping"],
    content: {
      agents: [
        { id: "1", name: "Commander-X", role: "orchestrator", model: "GPT-4o" },
        { id: "2", name: "Seeker-7", role: "researcher", model: "Claude 3.5 Sonnet" },
        { id: "3", name: "Insight-0", role: "analyst", model: "Gemini 1.5 Pro" }
      ],
      mission: "Create a comprehensive competitive analysis of the AI tutoring market in 2024."
    }
  },
  {
    id: 2,
    title: "SaaS Cold Outreach",
    type: "Prompt Template",
    description: "Highly optimized prompt for generating personalized LinkedIn outreach based on target profile data.",
    author: "Alex Rivera",
    stars: 89,
    downloads: "3.4k",
    category: "Prompt Templates",
    image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80&w=400",
    tags: ["Sales", "Copywriting"],
    content: {
      system: "You are a world-class sales copywriter.",
      user: "Write a LinkedIn message to {{prospect_name}} about {{product}}."
    }
  },
  {
    id: 3,
    title: "Enterprise MCP Bridge",
    type: "Workflows",
    description: "A complex workflow connecting local Excel files to GPT-4o using a custom MCP server bridge.",
    author: "Sarah Chen",
    stars: 256,
    downloads: "842",
    category: "Workflows",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400",
    tags: ["Enterprise", "Automation", "MCP"],
    content: {
      nodes: [
        { id: "1", type: "excel_source", label: "Excel Data" },
        { id: "2", type: "mcp_bridge", label: "MCP Bridge" },
        { id: "3", type: "llm_process", label: "GPT-4o Analysis" }
      ],
      edges: [
        { source: "1", target: "2" },
        { source: "2", target: "3" }
      ]
    }
  },
  {
    id: 4,
    title: "Creative Writer Suite",
    type: "Agent Squad",
    description: "Orchestrator and Editor agents that collaborate to turn a 1-sentence prompt into a 2000-word story.",
    author: "Jamie V.",
    stars: 412,
    downloads: "5.1k",
    category: "Agent Squads",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400",
    tags: ["Creative", "Claude 3.5"],
    content: {
      agents: [
        { id: "1", name: "Plotter", role: "orchestrator", model: "Claude 3.5" },
        { id: "2", name: "Scribe", role: "writer", model: "GPT-4o Mini" }
      ]
    }
  }
];

export default function MarketplacePage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveItems, setLiveItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [moderationMode, setModerationMode] = useState(false);
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  useEffect(() => {
    async function fetchMarketplace() {
      if (!isConfigured) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Transform Supabase data to match UI structure
        const transformed = data.map(item => ({
          id: item.id,
          title: item.title || "Untitled Template",
          type: item.type === 'agent_squad' ? 'Agent Squad' : 
                item.type === 'prompt_template' ? 'Prompt Template' : 'Workflows',
          description: item.description || "No description provided.",
          author: 'Anonymous',
          authorImage: null,
          stars: item.stars || 0,
          downloads: item.downloads || 0,
          category: item.type === 'agent_squad' ? 'Agent Squads' : 
                    item.type === 'prompt_template' ? 'Prompt Templates' : 'Workflows',
          image: item.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
          tags: item.tags || [],
          status: item.status || 'pending',
          isVetted: item.is_vetted || false,
          content: item.content || {}
        }));
        setLiveItems(transformed);
      }
      setLoading(false);
    }

    fetchMarketplace();
  }, []);

  // Combine static "Vetted" items with "Community" live items
  const allItems = [
    ...marketplaceItems.map(item => ({ ...item, isVetted: true, status: 'published' })),
    ...liveItems.filter(li => !marketplaceItems.some(mi => mi.title === li.title))
  ];

  const updateItemStatus = async (itemId: string, status: string) => {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('marketplace_listings')
      .update({ status })
      .eq('id', itemId);
    
    if (!error) {
      setLiveItems(prev => prev.map(item => item.id === itemId ? { ...item, status } : item));
    }
  };

  const toggleVetted = async (itemId: string, isVetted: boolean) => {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('marketplace_listings')
      .update({ is_vetted: isVetted })
      .eq('id', itemId);
    
    if (!error) {
      setLiveItems(prev => prev.map(item => item.id === itemId ? { ...item, isVetted } : item));
    }
  };

  const handleRemix = async (item: any) => {
    if (isConfigured && typeof item.id === 'string') {
      try {
        await supabase.rpc('increment_marketplace_downloads', { listing_id: item.id });
        setLiveItems(prev => prev.map(p => p.id === item.id ? { ...p, downloads: (parseInt(p.downloads) || 0) + 1 } : p));
      } catch (e) {
        console.error("Failed to increment downloads", e);
      }
    }

    // Determine the sandbox path based on type
    let path = "/sandbox/agent";
    if (item.type === "Prompt Template") path = "/sandbox/prompt";
    if (item.type === "Workflows") path = "/sandbox/workflow";
    
    router.push(`${path}?remix=${item.id}`);
  };

  const handleLike = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (isConfigured && typeof item.id === 'string') {
      try {
        await supabase.rpc('increment_marketplace_stars', { listing_id: item.id });
        setLiveItems(prev => prev.map(p => p.id === item.id ? { ...p, stars: p.stars + 1 } : p));
      } catch (e) {
        console.error("Failed to increment stars", e);
      }
    }
  };

  const filteredItems = allItems.filter(item => {
    const titleStr = (item.title || "").toLowerCase();
    const descStr = (item.description || "").toLowerCase();
    const searchStr = (searchQuery || "").toLowerCase();
    const matchesSearch = titleStr.includes(searchStr) || descStr.includes(searchStr);
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    
    if (moderationMode) {
      return matchesSearch && item.status === 'pending';
    }

    return matchesCategory && matchesSearch && (item.status === 'published' || item.isVetted);
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Hero / Search Section */}
      <div className="relative glass-strong rounded-[40px] p-12 overflow-hidden border border-[var(--border-color)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            The <span className="gradient-text">Automation</span> Marketplace
          </h2>
          <p className="text-[var(--muted)] mb-8 text-lg">
            Browse, import, and remix AI templates created by the world's best automation builders.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search templates, agents, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[var(--accent)]/40 focus:bg-white/[0.08] outline-none transition-all"
              />
            </div>
            <button className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-[var(--accent)]/20">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>

        {/* Floating elements for visual flair */}
        <div className="absolute right-[-10%] top-[-10%] w-[400px] h-[400px] bg-[var(--accent)]/5 blur-[100px] rounded-full" />
        <div className="absolute right-10 bottom-10 hidden lg:flex items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-black text-white">12k+</div>
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Active Users</div>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="flex flex-col items-center">
            <div className="text-3xl font-black text-white">2.5k</div>
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Templates</div>
          </div>
        </div>
      </div>

      {/* Categories & Moderation Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat 
                  ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" 
                  : "bg-white/5 border-white/5 text-[var(--muted)] hover:text-white hover:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isAdmin && (
          <button
            onClick={() => setModerationMode(!moderationMode)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold border transition-all ${
              moderationMode 
                ? "bg-amber-500/20 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/20" 
                : "bg-white/5 border-white/5 text-[var(--muted)] hover:text-white hover:border-white/10"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {moderationMode ? "Exit Moderation" : "Moderation Queue"}
            {liveItems.filter(i => i.status === 'pending').length > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] flex items-center justify-center">
                {liveItems.filter(i => i.status === 'pending').length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-strong rounded-3xl overflow-hidden border border-[var(--border-color)] group hover:border-[var(--accent)]/30 transition-all duration-500"
            >
              {/* Card Image */}
              <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--surface)]" />
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A120B] to-transparent" />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="badge !bg-black/60 backdrop-blur-md !border-white/10">
                    {item.type === "Agent Squad" && <Bot className="w-3 h-3" />}
                    {item.type === "Prompt Template" && <Terminal className="w-3 h-3" />}
                    {item.type === "Workflows" && <Layers className="w-3 h-3" />}
                    {item.type}
                  </div>
                  {item.isVetted && (
                    <div className="badge !bg-[var(--accent)]/20 !text-[var(--accent)] !border-[var(--accent)]/30 !py-0.5 !px-2 !text-[8px]">
                      Vetted Template
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-[10px] font-bold text-white border border-white/20">
                      {item.author[0]}
                    </div>
                    <span className="text-[10px] font-bold text-white/80">{item.author}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => handleLike(e, item)}
                      className="flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className="w-3 h-3 fill-amber-400" />
                      {item.stars}
                    </button>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--muted)]">
                      <Download className="w-3 h-3" />
                      {item.downloads}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors">{item.title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {item.tags.map((tag: string) => (
                    <span key={tag} className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider px-2 py-1 bg-white/5 rounded-md border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-6 flex gap-3">
                  {moderationMode ? (
                    <>
                      <button 
                        onClick={() => updateItemStatus(item.id, 'rejected')}
                        className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Close className="w-4 h-4" />
                        Reject
                      </button>
                      <button 
                        onClick={() => updateItemStatus(item.id, 'published')}
                        className="flex-1 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setPreviewItem(item)}
                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button 
                        onClick={() => handleRemix(item)}
                        className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-white text-[10px] font-bold shadow-lg shadow-[var(--accent)]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Remix
                      </button>
                    </>
                  )}
                </div>

                {isAdmin && !moderationMode && !item.isVetted && (
                  <div className="pt-2">
                    <button 
                      onClick={() => toggleVetted(item.id, !item.isVetted)}
                      className="w-full py-2 rounded-lg border border-white/5 text-[9px] font-bold text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/20 transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      {item.isVetted ? "Unvet Template" : "Mark as Vetted"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Featured Authors / Trending section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-strong p-8 rounded-[40px] border border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-[var(--accent)]" />
              <h3 className="text-xl font-bold text-white">Trending Builders</h3>
            </div>
            <button className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest hover:text-white transition-colors">View All</button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-black text-white/20 italic group-hover:text-[var(--accent)] transition-colors">{i}</div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-bold text-white">
                    {["A", "S", "J"][i-1]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {["Alex Rivera", "Sarah Chen", "Jamie V."][i-1]}
                    </div>
                    <div className="text-[10px] font-medium text-[var(--muted)]">Level {12 + i} AI Architect</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm font-bold text-[var(--accent)]">{[1.4, 2.1, 0.8][i-1]}k</div>
                  <div className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest">Remixes</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong p-8 rounded-[40px] border border-[var(--border-color)] relative overflow-hidden flex flex-col justify-center text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,187,23,0.1)_0%,transparent_70%)]" />
          <div className="relative z-10 space-y-4">
            <Sparkles className="w-12 h-12 text-[var(--accent)] mx-auto mb-2 animate-pulse" />
            <h3 className="text-2xl font-bold text-white">Share Your Creation</h3>
            <p className="text-[var(--muted)] text-sm max-w-xs mx-auto">
              Build something incredible in the sandboxes and list it on the marketplace to earn XP and recognition.
            </p>
            <button className="mt-4 px-8 py-3 bg-white text-black font-bold text-sm rounded-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              List a Template
            </button>
          </div>
        </div>
      </div>
      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-strong rounded-[40px] border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
                    {previewItem.type === "Agent Squad" && <Bot className="w-6 h-6 text-[var(--accent)]" />}
                    {previewItem.type === "Prompt Template" && <Terminal className="w-6 h-6 text-[var(--accent)]" />}
                    {previewItem.type === "Workflows" && <Layers className="w-6 h-6 text-[var(--accent)]" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{previewItem.title}</h2>
                    <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-bold">{previewItem.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewItem(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[var(--muted)] hover:text-white transition-all"
                >
                  <Close className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Description</h4>
                  <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                    {previewItem.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Configuration Structure</h4>
                  <div className="bg-black/40 rounded-2xl border border-white/5 p-6 font-mono text-xs overflow-x-auto">
                    <pre className="text-[var(--accent)]">
                      {JSON.stringify(previewItem.content, null, 2) === "{}" 
                        ? "// This is a vetted platform template. \n// Click 'Remix' to load the full configuration into your sandbox."
                        : JSON.stringify(previewItem.content, null, 2)
                      }
                    </pre>
                  </div>
                </div>

                {previewItem.tags.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {previewItem.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
                <button 
                  onClick={() => setPreviewItem(null)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-all"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setPreviewItem(null);
                    handleRemix(previewItem);
                  }}
                  className="flex-1 py-4 rounded-2xl bg-[var(--accent)] text-white text-sm font-bold shadow-xl shadow-[var(--accent)]/20 hover:brightness-110 transition-all flex items-center justify-center gap-3"
                >
                  <Zap className="w-4 h-4" />
                  Remix Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

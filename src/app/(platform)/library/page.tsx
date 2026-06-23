"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Clock, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight,
  Bookmark,
  Share2,
  Headphones,
  Video as VideoIcon,
  GraduationCap,
  TrendingUp,
  X as Close,
  Volume2,
  Maximize2,
  Settings,
  Plus
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { VideoModal } from "@/components/platform/library/VideoModal";

// Detects URL type and returns a ready-to-embed URL
function getEmbedInfo(url: string): { type: 'youtube' | 'vimeo' | 'mp4'; embedUrl: string } {
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch) {
    return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1` };
  }
  const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
  if (vimeoMatch) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0` };
  }
  return { type: 'mp4', embedUrl: url };
}

const INITIAL_VIDEOS = [
  {
    id: "v1",
    title: "AI Foundations: The Strategic Layer",
    description: "Overview of the first 9 lessons. Understanding the mechanics of LLMs and the shifting landscape of AI building.",
    duration: "19:13",
    type: "Pod-Brief",
    category: "AI Foundations",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
    date: "Latest",
    views: "1.2k",
    lessonLink: "/learn/beginner/1",
    lessonNumber: 1
  },
  {
    id: "v2",
    title: "The Automation Stack: Architecture",
    description: "Deep dive into governance and resilience. How to build systems that don't break when models change.",
    duration: "21:00",
    type: "Tutorial",
    category: "The Automation Stack",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
    date: "New",
    views: "850",
    lessonLink: "/learn/intermediate/10",
    lessonNumber: 10
  },
  {
    id: "v3",
    title: "Agent Engineering: Reasoning Trees",
    description: "Synthesized briefing on the upcoming Agent Engineering track. Mastering ReAct and swarm patterns.",
    duration: "13:15",
    type: "Pod-Brief",
    category: "Agent Engineering",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/watch?v=Ilg3gGewQ5U",
    date: "Upcoming",
    views: "2.4k",
    lessonLink: "/learn/builder/18",
    lessonNumber: 18
  },
  {
    id: "v4",
    title: "AIOps: Scaling Agentic Systems",
    description: "From sandbox to production. Managing latency, costs, and token consumption at scale.",
    duration: "10:05",
    type: "Theory",
    category: "AI Operations",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4628c6750?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/watch?v=tIeHLnjs5U8",
    date: "Beta",
    views: "920",
    lessonLink: "/learn/expert/34",
    lessonNumber: 34
  }
];

export default function LibraryPage() {
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const [managementMode, setManagementMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any | null>(null);
  const { isAdmin } = useAuth();

  const categories = ["All", "AI Foundations", "The Automation Stack", "Agent Engineering", "AI for Business", "AI Operations"];

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || v.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSaveVideo = (videoData: any) => {
    if (editingVideo) {
      setVideos(videos.map(v => v.id === videoData.id ? videoData : v));
    } else {
      setVideos([videoData, ...videos]);
    }
    setIsModalOpen(false);
    setEditingVideo(null);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("Are you sure you want to remove this briefing?")) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  const handleEditVideo = (video: any) => {
    setEditingVideo(video);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingVideo(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Section */}
      <div className="relative glass-strong rounded-[40px] p-12 overflow-hidden border border-[var(--border-color)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="badge !bg-[rgba(76,187,23,0.1)] !border-[rgba(76,187,23,0.2)] !text-[var(--accent)]">
              <Sparkles className="w-3.5 h-3.5" />
              NotebookLM Powered
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Knowledge <span className="gradient-text">Library</span>
          </h2>
          <p className="text-[var(--muted)] mb-8 text-lg">
            High-fidelity pod-briefs and video deep-dives synthesized from the latest AI research and platform data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search briefings, tutorials, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[var(--accent)]/40 focus:bg-white/[0.08] outline-none transition-all"
              />
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <button 
                  onClick={() => setManagementMode(!managementMode)}
                  className={`px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border ${
                    managementMode 
                      ? "bg-amber-500/20 border-amber-500 text-amber-500 shadow-xl shadow-amber-500/20" 
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  {managementMode ? "Exit Manager" : "Library Admin"}
                </button>
                {managementMode && (
                  <button 
                    onClick={handleAddNew}
                    className="px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-[var(--accent)] border-[var(--accent)] text-white hover:brightness-110 shadow-xl shadow-[var(--accent)]/20 animate-in zoom-in-95 duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    Add Briefing
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block">
          <div className="w-full h-full relative opacity-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-[var(--accent)]/20 rounded-full animate-spin-slow" />
            <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-[var(--accent)] fill-[var(--accent)]/20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeFilter === filter 
                ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" 
                : "bg-white/5 border-white/5 text-[var(--muted)] hover:text-white hover:border-white/10"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Featured Video / Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredVideos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-strong rounded-3xl overflow-hidden border border-[var(--border-color)] group hover:border-[var(--accent)]/30 transition-all duration-500"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image 
                    src={video.thumbnail} 
                    alt={video.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-[var(--accent)]/20 backdrop-blur-md border border-[var(--accent)]/50 flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="badge !bg-black/60 backdrop-blur-md !border-white/10 !text-white !py-1 !px-2">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                    <div className="flex gap-2">
                       <button className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-[var(--accent)] transition-colors">
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-[var(--accent)] transition-colors">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">{video.type}</span>
                    <span className="text-[var(--muted)]">•</span>
                    <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">{video.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors leading-tight">
                    {video.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setActiveVideo(video)}
                        className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[var(--accent)]/10 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        Watch Brief
                      </button>
                      <a 
                        href={video.lessonLink} 
                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <GraduationCap className="w-3 h-3" />
                        Start Lesson {video.lessonNumber}
                      </a>
                    </div>
                    
                    {managementMode && (
                      <div className="flex gap-2 pt-2 border-t border-white/5">
                        <button 
                          onClick={() => handleEditVideo(video)}
                          className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-white hover:bg-[var(--accent)]/20 transition-all"
                        >
                          Edit Info
                        </button>
                        <button 
                          onClick={() => handleDeleteVideo(video.id)}
                          className="flex-1 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[9px] font-bold text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar / Trending */}
        <div className="space-y-8">
          <div className="glass-strong p-8 rounded-[40px] border border-[var(--border-color)]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
              Most Popular
            </h3>
            <div className="space-y-6">
              {videos.slice(0, 3).map((v, i) => (
                <div key={v.id} className="flex gap-4 group cursor-pointer">
                  <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border border-white/10">
                    <Image src={v.thumbnail} alt={v.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
                      {v.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-[var(--muted)]">
                      <span>{v.views} views</span>
                      <span>•</span>
                      <span>{v.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-[var(--muted)] hover:text-white transition-all uppercase tracking-widest">
              View All Insights
            </button>
          </div>

          {/* Call to action */}
          <div className="glass-strong p-8 rounded-[40px] border border-[var(--accent)]/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none" />
            <Sparkles className="w-10 h-10 text-[var(--accent)] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Request a Brief</h3>
            <p className="text-sm text-[var(--muted)] mb-6">
              Have a complex document or research paper? Let us synthesize it into a Pod-Brief for you.
            </p>
            <button className="w-full py-4 rounded-2xl bg-[var(--accent)] text-white font-bold text-xs shadow-lg shadow-[var(--accent)]/20 hover:brightness-110 transition-all">
              Submit Document
            </button>
          </div>
        </div>
      </div>
      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop — clicking this closes the modal */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={() => setActiveVideo(null)}
          />
          {/* Modal — stopPropagation prevents backdrop from stealing inner clicks */}
          <div
            className="relative z-10 w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-strong rounded-[28px] border border-white/10 overflow-hidden shadow-2xl">
              {/* Header: title + close button — ABOVE the video, never overlaid on it */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                    {activeVideo.type}
                  </span>
                  <h2 className="text-sm font-bold text-white truncate">{activeVideo.title}</h2>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="ml-4 shrink-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition-all"
                >
                  <Close className="w-4 h-4" />
                </button>
              </div>

              {/* Video — full width, zero overlays so native controls are fully accessible */}
              <div className="aspect-video bg-black">
                {(() => {
                  const embed = getEmbedInfo(activeVideo.videoUrl);
                  if (embed.type === 'mp4') {
                    return (
                      <video
                        key={activeVideo.id}
                        src={embed.embedUrl}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full"
                        poster={activeVideo.thumbnail}
                      />
                    );
                  }
                  return (
                    <iframe
                      key={activeVideo.id}
                      src={embed.embedUrl}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  );
                })()}
              </div>

              {/* Info section */}
              <div className="p-6 bg-white/[0.02]">
                <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">About this briefing</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{activeVideo.description}</p>
                  </div>
                  <div className="flex flex-col gap-3 shrink-0">
                    <a
                      href={activeVideo.lessonLink}
                      className="px-6 py-3 rounded-2xl bg-white text-black font-bold text-xs hover:shadow-2xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Start Lesson {activeVideo.lessonNumber}
                    </a>
                    <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">
                      Download Resources
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <VideoModal 
            video={editingVideo}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveVideo}
          />
        )}
      </AnimatePresence>
    </div>
  );
}



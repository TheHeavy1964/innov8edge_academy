"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X as Close, Save, Video as VideoIcon, Image as ImageIcon, Link as LinkIcon, Type } from "lucide-react";

interface VideoModalProps {
  video: any | null;
  onClose: () => void;
  onSave: (video: any) => void;
}

export function VideoModal({ video, onClose, onSave }: VideoModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    duration: "",
    type: "Pod-Brief",
    category: "AI Foundations",
    thumbnail: "",
    videoUrl: "",
    date: "New",
    views: "0",
    lessonLink: "/learn/foundations/1",
    lessonNumber: 1
  });

  useEffect(() => {
    if (video) {
      setFormData(video);
    } else {
      setFormData({
        id: `v${Date.now()}`,
        title: "",
        description: "",
        duration: "00:00",
        type: "Pod-Brief",
        category: "AI Foundations",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        videoUrl: "",
        date: "New",
        views: "0",
        lessonLink: "/learn/foundations/1",
        lessonNumber: 1
      });
    }
  }, [video]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl glass-strong rounded-[40px] border border-white/10 overflow-hidden shadow-2xl bg-[#0A120B]"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
              <VideoIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {video ? "Edit Video Briefing" : "Add New Briefing"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Title</label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all"
                  placeholder="The Future of Agentic Systems..."
                />
              </div>
            </div>

            {/* Video URL */}
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Video URL — YouTube, Vimeo, or direct MP4</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input 
                  required
                  value={formData.videoUrl}
                  onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <p className="text-[10px] text-[var(--muted)] ml-1">Paste any YouTube, Vimeo, or direct .mp4 link — the player auto-detects the format.</p>
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Thumbnail Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input 
                  value={formData.thumbnail}
                  onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all"
                  placeholder="https://unsplash.com/..."
                />
              </div>
            </div>

            {/* Category & Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all appearance-none"
              >
                {["AI Foundations", "The Automation Stack", "Agent Engineering", "AI for Business", "AI Operations"].map(c => (
                  <option key={c} value={c} className="bg-neutral-900">{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all appearance-none"
              >
                {["Pod-Brief", "Tutorial", "Theory", "Case Study"].map(t => (
                  <option key={t} value={t} className="bg-neutral-900">{t}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Duration</label>
              <input 
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all"
                placeholder="12:45"
              />
            </div>

            {/* Lesson Link */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Connected Lesson (Link)</label>
              <input 
                value={formData.lessonLink}
                onChange={e => setFormData({...formData, lessonLink: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all"
                placeholder="/learn/foundations/1"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all resize-none"
                placeholder="Detailed briefing overview..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-primary !py-3 !px-10 !text-xs !rounded-2xl flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {video ? "Save Changes" : "Create Briefing"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

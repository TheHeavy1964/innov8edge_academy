"use client";

import { Bell, Search, User, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { usePlatform } from "@/context/PlatformContext";
import { useAuth } from "@/context/AuthContext";

export default function PlatformHeader({ title }: { title: string }) {
  const { elih, setElih } = usePlatform();
  const { user, isPro, trialDaysLeft } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Academy Member";
  const initials = userName[0].toUpperCase();

  return (
    <header className="h-[72px] border-b border-[var(--border-color)] px-8 flex items-center justify-between glass shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        
        <div className="hidden lg:flex items-center gap-4 ml-4 pr-4 border-r border-white/5">
          {trialDaysLeft > 0 ? (
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20 transition-all cursor-pointer group"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {trialDaysLeft} Days Left in Pro Trial
              </span>
            </button>
          ) : isPro ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-color)]">
              <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Pro Active</span>
            </div>
          ) : (
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-color)] hover:border-[var(--accent)]/50 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-[var(--muted)]" />
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Free Tier</span>
            </button>
          )}

          <button 
            onClick={() => setElih(!elih)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
              elih 
                ? 'bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]' 
                : 'bg-white/5 border-white/10 text-[var(--muted)] hover:text-white'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${elih ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {elih ? 'ELIH: Mode Active' : 'Explain Like I\'m Human'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-[var(--border-color)] w-64 group focus-within:border-[var(--primary)]/50 transition-all">
          <Search className="w-4 h-4 text-[var(--muted)] group-focus-within:text-[var(--primary-light)]" />
          <input
            type="text"
            placeholder="Search lessons..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder-[var(--muted)] w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--muted)] hover:text-white hover:bg-white/5 transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[#111D13]" />
          </button>
          
          <div className="w-[1px] h-6 bg-[var(--border-color)] mx-2" />

          <div className="flex items-center gap-3 pl-2 group cursor-pointer">
            <div className="text-right hidden lg:block">
              <div className="text-sm font-bold text-white group-hover:text-[var(--primary-light)] transition-colors">{userName}</div>
              <div className="text-[10px] font-medium text-[var(--muted)]">Level 12 AI Builder</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--hunter-green)] flex items-center justify-center border border-white/10 shadow-lg text-white font-bold">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full rounded-xl object-cover" />
              ) : (
                initials
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

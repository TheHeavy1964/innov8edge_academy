"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  Cpu, 
  Rocket, 
  Briefcase,
  Building,
  ChevronRight, 
  PlayCircle,
  Clock,
  BarChart3,
  CheckCircle2,
  Lock,
  AlertTriangle,
  RotateCcw
} from "lucide-react";

import { useProgress } from "@/hooks/useProgress";
import { useState } from "react";
import { trackDefinitions } from "@/lib/curriculum";

export default function LearnPage() {
  const { progress, loading, resetTrack } = useProgress();
  const [confirmTrackId, setConfirmTrackId] = useState<string | null>(null);
  const [resettingTrackId, setResettingTrackId] = useState<string | null>(null);

  const handleResetTrack = async (trackId: string, lessonIds: string[]) => {
    if (confirmTrackId !== trackId) {
      setConfirmTrackId(trackId);
      setTimeout(() => setConfirmTrackId(null), 3000);
      return;
    }
    setResettingTrackId(trackId);
    await resetTrack(lessonIds);
    setResettingTrackId(null);
    setConfirmTrackId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest animate-pulse">Syncing Learning Progress...</p>
      </div>
    );
  }

  const tracks = trackDefinitions.map(track => {
    const trackProgress = progress.filter(p => track.lessonIds.includes(p.lesson_id));
    const completedCount = trackProgress.filter(p => p.status === 'completed').length;
    const percent = track.lessonIds.length > 0 
      ? Math.round((completedCount / track.lessonIds.length) * 100) 
      : 0;

    return {
      ...track,
      progress: percent,
      courses: track.courses.map(course => ({
        ...course,
        completed: progress.find(p => p.lesson_id === course.id)?.status === 'completed'
      }))
    };
  });
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">My Learning Paths</h2>
        <p className="text-[var(--muted)]">Continue your journey to becoming a certified AI automation builder.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {tracks.map((track) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl overflow-hidden group hover:border-[var(--primary)]/30 transition-all duration-500 border border-[var(--border-color)]"
          >
            <div className="p-8">
              {/* Top Row */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 duration-500"
                    style={{ background: `linear-gradient(135deg, ${track.color}20, ${track.color}40)`, border: `1px solid ${track.color}40` }}
                  >
                    <track.icon className="w-7 h-7 text-white" style={{ color: track.color }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-white/5 border border-white/10 mb-1 inline-block" style={{ color: track.color }}>
                      {track.tier} Track
                    </span>
                    <h3 className="text-xl font-bold text-white">{track.title}</h3>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div>
                    <div className="text-2xl font-black text-white leading-none">{track.progress}%</div>
                    <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter">Completed</div>
                  </div>
                  {track.progress > 0 && (
                    <button
                      onClick={(e) => { e.preventDefault(); handleResetTrack(track.id, track.lessonIds); }}
                      disabled={resettingTrackId === track.id}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all duration-200 border ${
                        confirmTrackId === track.id
                          ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'
                          : 'bg-white/5 text-[var(--muted)] hover:text-white border-white/5 hover:border-white/20'
                      }`}
                    >
                      {resettingTrackId === track.id ? (
                        <div className="w-2.5 h-2.5 border border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <RotateCcw className="w-2.5 h-2.5" />
                      )}
                      {confirmTrackId === track.id ? 'Confirm reset' : 'Reset'}
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
                {track.description}
              </p>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-white/5 rounded-full mb-10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${track.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{ background: track.color }}
                />
              </div>

              {/* Course List Preview */}
              <div className="space-y-3">
                {track.courses.map((course) => (
                  <Link 
                    href={`/learn/${track.id}/lesson/${course.id}`}
                    key={course.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-3">
                      {course.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                      ) : (
                        <PlayCircle className="w-4 h-4 text-[var(--muted)] group-hover/item:text-white" />
                      )}
                      <span className={`text-sm font-medium ${course.completed ? 'text-[var(--muted)]' : 'text-white'}`}>
                        {course.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[10px] text-[var(--muted)] font-medium">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover/item:text-[var(--accent)] group-hover/item:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Bottom CTA */}
              <Link
                href={`/learn/${track.id}`}
                className="mt-8 w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-xl overflow-hidden relative group/btn"
                style={{ background: track.progress === 100 ? 'rgba(161, 204, 165, 0.1)' : track.color, border: track.progress === 100 ? `1px solid ${track.color}40` : 'none', color: track.progress === 100 ? track.color : '#fff' }}
              >
                {track.progress === 100 ? (
                  <>Track Completed <CheckCircle2 className="w-4 h-4" /></>
                ) : track.progress > 0 ? (
                  <>Continue Learning <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>Start Track <Rocket className="w-4 h-4" /></>
                )}
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

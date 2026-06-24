"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Flame, 
  Clock, 
  ArrowUpRight,
  Play,
  ShoppingBag,
  Zap,
  Star,
  Users,
  Calendar,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { supabase, isConfigured } from "@/lib/supabase";
import { getAllLessons } from "@/lib/curriculum";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const router = useRouter();
  const [trending, setTrending] = useState<any[]>([]);

  // Calculate stats from real progress
  const lessonsDone = progress.filter(p => p.status === 'completed').length;
  
  // Calculate average progress across all started lessons
  const averageProgress = useMemo(() => {
    if (progress.length === 0) return 0;
    const total = progress.reduce((acc, curr) => acc + (curr.percent_complete || (curr.status === 'completed' ? 100 : 0)), 0);
    return Math.round(total / progress.length);
  }, [progress]);

  // Find the last active lesson to resume
  const resumeLesson = useMemo(() => {
    const allLessons = getAllLessons();
    // Sort progress by updated_at descending to find the most recent activity
    const sortedProgress = [...progress].sort((a, b) => 
      new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
    );

    const lastActive = sortedProgress.find(p => p.status !== 'completed') || sortedProgress[0];
    
    if (lastActive) {
      const lessonDetails = allLessons.find(l => l.id === lastActive.lesson_id);
      if (lessonDetails) {
        return {
          ...lessonDetails,
          percent: lastActive.percent_complete || 0
        };
      }
    }

    // Default to first lesson if nothing started
    return {
      ...allLessons[0],
      percent: 0
    };
  }, [progress]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchTrending() {
      if (!isConfigured) return;
      
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .order('stars', { ascending: false })
        .limit(3);

      if (!error && data) {
        setTrending(data);
      }
    }
    fetchTrending();
  }, []);

  const handleRemix = (item: any) => {
    let path = "/sandbox/agent";
    if (item.type === "prompt_template") path = "/sandbox/prompt";
    if (item.type === "workflow") path = "/sandbox/workflow";
    router.push(`${path}?remix=${item.id}`);
  };

  if (authLoading || progressLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest animate-pulse">Syncing Your Workspace...</p>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { label: "Course Progress", value: `${averageProgress}%`, icon: Target, color: "#60A5FA", trend: "+12%" },
    { label: "Lessons Done", value: lessonsDone.toString(), icon: Trophy, color: "#FBBF24", trend: "+2" },
    { label: "Day Streak", value: "0", icon: Flame, color: "#F97316", trend: "Active" },
    { label: "Learning Time", value: "0h", icon: Clock, color: "#34D399", trend: "+0h" },
  ];

  const events = [
    { title: "Weekly Office Hours", time: "Today, 4:00 PM", type: "Live Q&A", day: "T" },
    { title: "Agentic Design Workshop", time: "Tomorrow, 10:00 AM", type: "Workshop", day: "T" },
    { title: "Community Showcase", time: "Friday, 2:00 PM", type: "Social", day: "F" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
            Welcome back, <span className="gradient-text">{user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}</span>! 👋
          </h2>
          <p className="text-[var(--muted)] font-medium">You're making great progress. You've completed {lessonsDone} lessons so far.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0D160F] bg-[var(--surface-elevated)] overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all cursor-pointer" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#0D160F] bg-[var(--accent)] flex items-center justify-center text-[10px] font-bold text-white z-10">
              +82
            </div>
          </div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-tighter">Others Learning Now</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-strong p-6 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--accent)]/10 px-2 py-1 rounded-full border border-[var(--accent)]/20">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-black text-white leading-none mb-1 tracking-tighter">{stat.value}</div>
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-[var(--accent)] fill-[var(--accent)]" />
              Continue Learning
            </h3>
            <button 
              onClick={() => router.push('/learn')}
              className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest hover:text-white transition-colors"
            >
              View Curriculum
            </button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-[2.5rem] overflow-hidden border border-white/5 relative group cursor-pointer"
            onClick={() => router.push(`/learn/${resumeLesson.trackId}/lesson/${resumeLesson.id}`)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/10 to-transparent pointer-events-none group-hover:from-[var(--accent)]/20 transition-all duration-500" />
            <div className="p-8 relative flex flex-col sm:flex-row gap-8 items-center">
              <div className="w-full sm:w-56 aspect-video rounded-3xl bg-[var(--surface-elevated)] border border-white/10 flex items-center justify-center relative overflow-hidden group/thumb shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600')] bg-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 z-10 shadow-2xl group-hover/thumb:scale-110 transition-transform duration-500">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
                {resumeLesson.percent > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-[var(--accent)]" style={{ width: `${resumeLesson.percent}%` }} />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                  <span 
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{ color: resumeLesson.color, borderColor: `${resumeLesson.color}40`, backgroundColor: `${resumeLesson.color}10` }}
                  >
                    {resumeLesson.tier}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--muted)] flex items-center gap-1.5 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    {resumeLesson.duration}
                  </span>
                  {resumeLesson.percent > 0 && (
                    <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-md">• {resumeLesson.percent}% Complete</span>
                  )}
                </div>
                <h4 className="text-3xl font-black text-white mb-2 tracking-tight group-hover:text-[var(--accent)] transition-colors">{resumeLesson.title}</h4>
                <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed max-w-md">Learn the strategic frameworks needed to implement agentic workflows in any business environment.</p>
                <button className="btn-primary !rounded-2xl !py-3.5 !px-8 flex items-center gap-2 group/btn">
                  Resume Lesson
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Events Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--accent)]" />
            Upcoming Events
          </h3>
          <div className="glass-strong rounded-[2.5rem] p-6 border border-white/5 space-y-4">
            {events.map((event, i) => (
              <motion.div 
                key={event.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex gap-4 items-center p-4 rounded-3xl hover:bg-white/[0.03] transition-all cursor-pointer border border-transparent hover:border-white/5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center shrink-0 group-hover:bg-[var(--accent)]/10 group-hover:border-[var(--accent)]/20 transition-all">
                  <span className="text-lg font-black text-white group-hover:text-[var(--accent)]">{event.day}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white mb-0.5 group-hover:text-[var(--accent)] transition-colors">{event.title}</div>
                  <div className="text-[10px] font-medium text-[var(--muted)]">{event.time}</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold text-[var(--muted)] uppercase tracking-widest group-hover:border-[var(--accent)]/20 group-hover:text-[var(--accent)] transition-all">
                  {event.type}
                </div>
              </motion.div>
            ))}
            <button className="w-full py-3 rounded-2xl text-[10px] font-bold text-[var(--muted)] hover:text-white hover:bg-white/5 border border-dashed border-white/10 hover:border-white/20 transition-all uppercase tracking-widest mt-2">
              View All Events
            </button>
          </div>
        </div>
      </div>

      {/* Community Spotlight */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <h3 className="text-xl font-bold text-white">Community Spotlight</h3>
          </div>
          <button 
            onClick={() => router.push('/marketplace')}
            className="flex items-center gap-2 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest hover:text-white transition-colors"
          >
            Explore Marketplace
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trending.length > 0 ? trending.map((item, i) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="glass-strong rounded-[2rem] border border-white/5 overflow-hidden group hover:border-[var(--accent)]/30 transition-all hover:shadow-2xl hover:shadow-[var(--accent)]/5"
            >
              <div className="h-40 bg-[var(--surface-elevated)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                  <Sparkles className="w-20 h-20 text-white" />
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                  {item.type.replace('_', ' ')}
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {item.stars}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-1 truncate group-hover:text-[var(--accent)] transition-colors">{item.title}</h4>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[8px] font-bold text-white uppercase">
                    {item.profiles?.full_name?.[0] || 'A'}
                  </div>
                  <span className="text-[10px] font-medium text-[var(--muted)]">by {item.profiles?.full_name || 'Anonymous'}</span>
                </div>
                <button 
                  onClick={() => handleRemix(item)}
                  className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:shadow-xl hover:shadow-[var(--accent)]/20 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Quick Remix
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="lg:col-span-3 py-20 flex flex-col items-center justify-center glass-strong rounded-[3rem] border border-dashed border-white/10 text-center bg-white/[0.01]">
              <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-white/10" />
              </div>
              <h4 className="text-lg font-bold text-white/40 uppercase tracking-widest mb-2">No Community Templates Yet</h4>
              <p className="text-sm text-white/20 max-w-xs leading-relaxed">Be the first to share your creation and inspire the next wave of AI builders.</p>
              <button className="mt-8 btn-secondary !rounded-2xl !py-3 !px-8 !text-xs">Publish Your First Agent</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

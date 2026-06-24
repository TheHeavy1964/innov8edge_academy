"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  GitBranch, 
  Globe, 
  Zap, 
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isConfigured } from "@/lib/supabase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleDemoLogin = () => {
    // This is just for UI testing until Supabase is connected
    router.push("/dashboard");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A120B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -ml-64 -mb-64" />

      <div className="max-w-md w-full relative z-10">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Landing</span>
        </Link>

        {/* Brand */}
        <div className="flex items-center gap-3 mb-10">
          <div className="relative w-10 h-10">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">Innov8Edge</h1>
            <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">Academy Builder</p>
          </div>
        </div>

        {/* Auth Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-[32px] border border-white/10 p-8 shadow-2xl"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Join the Academy"}
            </h2>
            <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
              {isLogin 
                ? "Enter your credentials to continue your AI building journey." 
                : "Create an account to track your progress and save your AI sandboxes."}
            </p>
          </div>

          {success ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <div className="text-emerald-400 font-bold">Check your email</div>
              <p className="text-sm text-white/70">We've sent a verification link to your email address.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="text-xs font-bold text-[var(--accent)] uppercase hover:underline"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-4">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all"
                        placeholder="Alex Rivera"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-4">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all"
                    placeholder="alex@innov8edge.io"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-4">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-bold uppercase text-center">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading || !isConfigured}
                className={`w-full btn-primary !py-4 !rounded-2xl shadow-xl mt-4 group transition-all ${
                  !isConfigured ? 'opacity-50 cursor-not-allowed bg-white/10 text-white/40' : 'shadow-[var(--accent)]/10'
                }`}
              >
                {!isConfigured 
                  ? "Supabase Connection Required" 
                  : (loading ? "Processing..." : isLogin ? "Launch Workspace" : "Create Account")
                }
                {isConfigured && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>

              {!isConfigured && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center">
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Developer Notice</p>
                    <p className="text-[10px] text-[var(--muted)] leading-relaxed italic">
                      "Supabase keys not detected in .env.local. Use Demo Mode to explore the UI."
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full py-4 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-white hover:bg-[var(--accent)]/20 transition-all text-xs font-bold flex items-center justify-center gap-2 group shadow-lg shadow-[var(--accent)]/5"
                  >
                    <Zap className="w-4 h-4 text-[var(--accent)]" />
                    Launch Demo Mode
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform opacity-40" />
                  </button>
                </div>
              )}

              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-[var(--muted)]">
                  <span className="bg-[#0A120B] px-4 tracking-widest">Or Continue With</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button" 
                  onClick={() => handleOAuth('google')}
                  disabled={loading || !isConfigured}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Globe className="w-4 h-4" />
                  Google
                </button>
                <button 
                  type="button" 
                  onClick={() => handleOAuth('github')}
                  disabled={loading || !isConfigured}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <GitBranch className="w-4 h-4" />
                  GitHub
                </button>
              </div>

              <div className="pt-8 text-center">
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs font-medium text-[var(--muted)] hover:text-white transition-colors"
                >
                  {isLogin ? "New to the Academy?" : "Already have an account?"} <span className="text-[var(--accent)] font-bold ml-1">{isLogin ? "Sign Up" : "Sign In"}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Secured by Supabase Identity
        </div>
      </div>
    </div>
  );
}

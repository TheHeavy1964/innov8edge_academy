"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, Smartphone, ChevronRight, LogOut } from "lucide-react";

export function SecurityTab() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const activeSessions = [
    { id: 1, device: "Chrome on Windows", location: "New York, USA", current: true, time: "Active now" },
    { id: 2, device: "Safari on iPhone", location: "New York, USA", current: false, time: "2 hours ago" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Change Password */}
      <div className="glass-strong p-8 rounded-3xl border border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Security Credentials</h4>
              <p className="text-xs text-[var(--muted)]">Update your password and secure your account.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-xs font-bold text-[var(--accent)] hover:underline"
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>
        </div>

        {showPasswordForm ? (
          <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Current Password</label>
                <input 
                  type="password" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">New Password</label>
                <input 
                  type="password" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="btn-primary !py-2 !px-6 !text-xs !rounded-xl">Update Password</button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm text-white">Password was last changed 3 months ago</span>
            </div>
          </div>
        )}
      </div>

      {/* 2FA */}
      <div className="glass-strong p-8 rounded-3xl border border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Two-Factor Authentication</h4>
              <p className="text-xs text-[var(--muted)]">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Disabled</span>
            <button className="w-10 h-5 rounded-full bg-white/10 relative transition-all">
              <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white/40" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="glass-strong p-8 rounded-3xl border border-[var(--border-color)]">
        <h4 className="text-lg font-bold text-white mb-6">Active Sessions</h4>
        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div key={session.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${session.current ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-white/5 text-[var(--muted)]'}`}>
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {session.device}
                    {session.current && <span className="text-[8px] bg-[var(--accent)]/20 text-[var(--accent)] px-1.5 py-0.5 rounded uppercase tracking-tighter">Current</span>}
                  </div>
                  <div className="text-[10px] text-[var(--muted)]">{session.location} • {session.time}</div>
                </div>
              </div>
              {!session.current && (
                <button className="text-[10px] font-bold text-red-400 hover:underline">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

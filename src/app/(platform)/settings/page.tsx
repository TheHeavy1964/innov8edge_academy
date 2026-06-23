"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell, 
  Key, 
  Smartphone,
  Save,
  Camera,
  LogOut,
  Zap,
  CreditCard
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { SecurityTab } from "@/components/platform/settings/SecurityTab";
import { NotificationsTab } from "@/components/platform/settings/NotificationsTab";

export default function SettingsPage() {
  const { user, signOut, isDemo } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
    { id: "api", label: "API Keys", icon: Key },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const handlePortal = async () => {
    // ... same logic
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Platform Settings</h2>
        <p className="text-[var(--muted)]">Manage your account preferences and security configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab.id 
                  ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20" 
                  : "text-[var(--muted)] hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-4 border-t border-[var(--border-color)] mt-4">
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/5 transition-all font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Avatar Section */}
              <div className="glass-strong p-8 rounded-3xl border border-[var(--border-color)] flex items-center gap-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-[var(--accent)]/10 border-2 border-dashed border-[var(--accent)]/30 flex items-center justify-center text-3xl font-bold text-[var(--accent)]">
                    {user?.user_metadata?.full_name?.[0] || user?.email?.[0].toUpperCase()}
                  </div>
                  <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Your Avatar</h4>
                  <p className="text-xs text-[var(--muted)] mb-4">Upload a high-quality profile picture.</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all">Upload New</button>
                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-400/5 transition-all">Remove</button>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="glass-strong p-8 rounded-3xl border border-[var(--border-color)] space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                      <input 
                        type="text" 
                        defaultValue={user?.user_metadata?.full_name || "Demo Builder"}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                      <input 
                        type="email" 
                        disabled
                        defaultValue={user?.email || "demo@innov8edge.io"}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--muted)] outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Bio / Role</label>
                  <textarea 
                    placeholder="AI Automation Enthusiast..."
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-[var(--accent)]/40 outline-none transition-all resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button className="btn-primary !py-3 !px-8 !text-xs !rounded-xl flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Profile
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && <SecurityTab />}

          {activeTab === "api" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass-strong p-8 rounded-3xl border border-[var(--border-color)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">External Model Keys</h4>
                    <p className="text-xs text-[var(--muted)]">Connect your own API keys for the sandboxes.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { name: "OpenAI API Key", placeholder: "sk-...", status: "Not Connected" },
                    { name: "Anthropic API Key", placeholder: "sk-ant-...", status: "Connected" },
                    { name: "Google Gemini Key", placeholder: "AIza...", status: "Not Connected" },
                  ].map((key) => (
                    <div key={key.name} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white mb-1">{key.name}</div>
                        <input 
                          type="password" 
                          placeholder={key.placeholder}
                          className="w-full bg-transparent text-[var(--muted)] text-sm outline-none font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${key.status === "Connected" ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>
                          {key.status}
                        </span>
                        <button className="text-xs font-bold text-white hover:text-[var(--accent)] transition-colors">Update</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass-strong p-8 rounded-3xl border border-[var(--border-color)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Billing & Subscription</h4>
                    <p className="text-xs text-[var(--muted)]">Manage your plan, payment methods, and invoices.</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#415D43]/20 to-transparent border border-[var(--border-color)] mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">Current Plan</div>
                      <div className="text-2xl font-black text-white">Free Tier</div>
                    </div>
                    <div className="badge !bg-[var(--accent)]/10 !text-[var(--accent)] border border-[var(--accent)]/20">
                      Active
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted)] mb-6">
                    You are currently on the Free plan. Upgrade to Pro to unlock unlimited sandbox runs and advanced features.
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => window.location.href = '/pricing'}
                      className="btn-primary !py-2 !px-6 !text-xs !rounded-xl"
                    >
                      Upgrade Plan
                    </button>
                    <button 
                      onClick={handlePortal}
                      className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all"
                    >
                      Customer Portal
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
}

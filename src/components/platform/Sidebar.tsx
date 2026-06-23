"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Zap,
  Workflow,
  Shield,
  BrainCircuit,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  Network,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Learning Paths", icon: BookOpen, href: "/learn" },
  { label: "Video Library", icon: MessageSquare, href: "/library" },
  { label: "Prompt Playground", icon: Zap, href: "/sandbox/prompt" },
  { label: "Workflow Builder", icon: Workflow, href: "/sandbox/workflow" },
  { label: "MCP Playground", icon: Shield, href: "/sandbox/mcp" },
  { label: "Agent Simulator", icon: BrainCircuit, href: "/sandbox/agent" },
  { label: "Embedding Explorer", icon: Network, href: "/sandbox/embeddings" },
  { label: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="relative flex flex-col h-screen glass-strong border-r border-[var(--border-color)] transition-all duration-300 z-50"
    >
      {/* Logo Section */}
      <div className="h-[72px] flex items-center px-6 mb-4 overflow-hidden shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8 shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="font-bold text-white leading-tight">Innov8Edge</span>
              <span className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wider">Academy</span>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-[var(--primary)]/20 to-transparent text-white"
                  : "text-[var(--muted)] hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-6 bg-[var(--accent)] rounded-r-full"
                />
              )}
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[var(--accent)]" : "group-hover:text-white"}`} />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[var(--border-color)] space-y-1.5">
        {!collapsed && user && (
          <div className="px-4 py-3 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-bold text-xs">
              {user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </div>
              <div className="text-[9px] font-medium text-[var(--muted)] truncate uppercase tracking-tighter">
                Level 12 AI Builder
              </div>
            </div>
          </div>
        )}
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--muted)] hover:text-white hover:bg-white/5 transition-all group"
        >
          <Settings className="w-5 h-5 shrink-0 group-hover:rotate-45 transition-transform" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--muted)] hover:text-red-400 hover:bg-red-400/5 transition-all group"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full glass-strong border border-[var(--border-color)] flex items-center justify-center text-[var(--muted)] hover:text-white z-50 shadow-xl"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}

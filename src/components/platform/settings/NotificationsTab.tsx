"use client";

import { motion } from "framer-motion";
import { Bell, Mail, MessageSquare, Zap } from "lucide-react";

export function NotificationsTab() {
  const notificationGroups = [
    {
      title: "Email Notifications",
      icon: Mail,
      color: "blue",
      items: [
        { id: "email-product", label: "Product Updates", description: "New features, sandboxes, and curriculum updates.", enabled: true },
        { id: "email-security", label: "Security Alerts", description: "Login attempts, password changes, and account activity.", enabled: true },
        { id: "email-learning", label: "Learning Progress", description: "Weekly summaries and course completion certificates.", enabled: false },
      ]
    },
    {
      title: "Platform Alerts",
      icon: Bell,
      color: "green",
      items: [
        { id: "web-lesson", label: "New Lessons", description: "Get notified when new content is added to your tracks.", enabled: true },
        { id: "web-community", label: "Community Activity", description: "When someone likes or remixes your shared workflows.", enabled: true },
        { id: "web-system", label: "System Maintenance", description: "Important announcements about platform availability.", enabled: true },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {notificationGroups.map((group) => (
        <div key={group.title} className="glass-strong p-8 rounded-3xl border border-[var(--border-color)]">
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-2 rounded-lg bg-${group.color}-500/10 text-${group.color}-400 border border-${group.color}-500/20`}>
              <group.icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{group.title}</h4>
              <p className="text-xs text-[var(--muted)]">Manage how and when we reach out to you.</p>
            </div>
          </div>

          <div className="space-y-6">
            {group.items.map((item) => (
              <div key={item.id} className="flex items-start justify-between group">
                <div className="max-w-md">
                  <div className="text-sm font-bold text-white mb-1 group-hover:text-[var(--accent)] transition-colors">{item.label}</div>
                  <div className="text-xs text-[var(--muted)] leading-relaxed">{item.description}</div>
                </div>
                <button 
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 shrink-0 ${
                    item.enabled ? "bg-[var(--accent)]" : "bg-white/10"
                  }`}
                >
                  <div 
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                      item.enabled ? "left-7" : "left-1"
                    }`} 
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Global Push Toggle */}
      <div className="glass-strong p-8 rounded-3xl border border-[var(--border-color)] bg-gradient-to-r from-[var(--accent)]/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Browser Push Notifications</h4>
              <p className="text-xs text-[var(--muted)]">Stay updated in real-time even when the platform is closed.</p>
            </div>
          </div>
          <button className="btn-primary !py-2 !px-6 !text-xs !rounded-xl">Enable Browser Alerts</button>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import Sidebar from "@/components/platform/Sidebar";
import PlatformHeader from "@/components/platform/PlatformHeader";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AITutor from "@/components/platform/AITutor";
import { PlatformProvider } from "@/context/PlatformContext";
import { useAuth } from "@/context/AuthContext";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // Guard: Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Show nothing or a loader while checking auth
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0A120B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
          <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest animate-pulse">Initializing Academy...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user, return null (useEffect will handle redirect)
  if (!user) return null;

  // Dynamic title based on route
  const getTitle = () => {
    if (pathname.includes("/learn")) return "Learning Paths";
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/sandbox/prompt")) return "Prompt Playground";
    if (pathname.includes("/sandbox/workflow")) return "Workflow Builder";
    if (pathname.includes("/sandbox/mcp")) return "MCP Playground";
    if (pathname.includes("/sandbox/agent")) return "Agent Simulator";
    if (pathname.includes("/sandbox/embedding")) return "Embedding Explorer";
    if (pathname.includes("/marketplace")) return "Automation Marketplace";
    if (pathname.includes("/library")) return "Knowledge Library";
    if (pathname.includes("/settings")) return "Platform Settings";
    return "Innov8Edge Academy";
  };

  return (
    <PlatformProvider>
      <div className="flex h-screen bg-[#0A120B] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <PlatformHeader title={getTitle()} />
          <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,rgba(143,185,150,0.05)_0%,transparent_50%)] p-8">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
        <AITutor />
      </div>
    </PlatformProvider>
  );
}

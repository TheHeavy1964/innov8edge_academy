"use client";

import { useAuth } from "@/context/AuthContext";
import { Lock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  featureName?: string;
}

export default function ProGate({ children, fallback, featureName = "this feature" }: ProGateProps) {
  const { isPro } = useAuth();
  const router = useRouter();

  if (isPro) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-[var(--surface-elevated)]/50 backdrop-blur-md rounded-3xl border border-[var(--border-color)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(65,93,67,0.15),transparent_50%)]" />
      
      <div className="relative z-10 flex flex-col items-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#415D43] to-[#8FB996] flex items-center justify-center shadow-lg shadow-[#415D43]/20 mb-6 relative">
          <Lock className="w-8 h-8 text-white" />
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--accent)] border-2 border-[var(--surface-elevated)] flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3">
          Pro Feature Locked
        </h3>
        <p className="text-[var(--muted)] mb-8">
          You need an active Pro subscription to access {featureName}. Upgrade your plan to unlock unlimited sandboxes, advanced agents, and custom MCP tools.
        </p>
        
        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={() => router.push("/pricing")}
            className="w-full py-4 rounded-xl btn-primary font-bold shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 transition-all flex items-center justify-center gap-2"
          >
            Upgrade to Pro
            <Zap className="w-4 h-4" />
          </button>
          <button 
            onClick={() => router.back()}
            className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isConfigured } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isDemo: boolean;
  isPro: boolean;
  isAdmin: boolean;
  trialDaysLeft: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Derived state for Pro/Trial logic
  const [isPro, setIsPro] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  // Helper to calculate trial logic when user changes
  const updateTrialStatus = (currentUser: User | null, demoMode: boolean) => {
    if (demoMode) {
      setIsPro(true);
      setIsAdmin(true);
      setTrialDaysLeft(7);
      return;
    }
    
    if (!currentUser) {
      setIsPro(false);
      setTrialDaysLeft(0);
      return;
    }

    const adminEmails = ['martin', 'innov8edge', 'admin'];
    const adminCheck = adminEmails.some(kw => currentUser.email?.toLowerCase().includes(kw)) ||
                    currentUser.user_metadata?.role === 'admin';
    
    setIsAdmin(adminCheck);

    if (currentUser.user_metadata?.tier === 'pro' || adminCheck) {
      setIsPro(true);
      setTrialDaysLeft(0);
      return;
    }

    const createdAt = new Date(currentUser.created_at);
    const trialEndDate = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 0) {
      setIsPro(true);
      setTrialDaysLeft(daysLeft);
    } else {
      setIsPro(false);
      setTrialDaysLeft(0);
    }
  };

  useEffect(() => {
    if (!isConfigured) {
      // Mock user for demo mode
      const demoUser = { 
        id: 'demo-user', 
        email: 'demo@innov8edge.io',
        user_metadata: { full_name: 'Demo Builder' },
        created_at: new Date().toISOString()
      } as any;
      setUser(demoUser);
      setIsDemo(true);
      updateTrialStatus(demoUser, true);
      setLoading(false);
      return;
    }

    // Get initial session — on error, clear local state only (do NOT call signOut,
    // which destroys the session cookie and logs the user out platform-wide)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn("Auth session read error (clearing local state only):", error.message);
        setSession(null);
        setUser(null);
        updateTrialStatus(null, false);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        updateTrialStatus(session?.user ?? null, false);
      }
      setLoading(false);
    });

    // Listen for auth changes (including automatic token refreshes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        updateTrialStatus(null, false);
      } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setSession(session);
        setUser(session?.user ?? null);
        updateTrialStatus(session?.user ?? null, false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (isDemo) {
      setUser(null);
      setIsDemo(false);
      updateTrialStatus(null, false);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, isDemo, isPro, isAdmin, trialDaysLeft }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

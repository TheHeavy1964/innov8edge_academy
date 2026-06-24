"use client";

import { useState, useEffect, useRef } from "react";
import { supabase, isConfigured } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export interface UserMetrics {
  current_streak: number;
  total_learning_seconds: number;
  last_login_date: string;
}

export function useMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<UserMetrics>({
    current_streak: 0,
    total_learning_seconds: 0,
    last_login_date: ""
  });
  const [loading, setLoading] = useState(true);

  // For the stopwatch
  const lastTickRef = useRef<number>(Date.now());

  const fetchAndProcessMetrics = async () => {
    if (!user || !isConfigured) {
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    // 1. Fetch current metrics
    const { data: currentMetrics, error: fetchError } = await supabase
      .from('user_metrics')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching metrics", fetchError);
      setLoading(false);
      return;
    }

    let current_streak = currentMetrics?.current_streak || 0;
    let total_learning_seconds = currentMetrics?.total_learning_seconds || 0;
    let last_login_date = currentMetrics?.last_login_date || "";

    // 2. Process Login Streak Logic
    let needsUpdate = false;
    
    if (last_login_date !== today) {
      needsUpdate = true;
      if (!last_login_date) {
        current_streak = 1;
      } else {
        const lastDate = new Date(last_login_date);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
          // Logged in exactly yesterday
          current_streak += 1;
        } else if (diffDays > 1) {
          // Streak broken
          current_streak = 1;
        }
      }
      last_login_date = today;
    }

    // 3. Update if needed, otherwise just set state
    if (needsUpdate || !currentMetrics) {
      const { data: updatedData, error: upsertError } = await supabase
        .from('user_metrics')
        .upsert({
          user_id: user.id,
          current_streak,
          last_login_date,
          total_learning_seconds
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (!upsertError && updatedData) {
        setMetrics(updatedData);
      }
    } else {
      setMetrics(currentMetrics);
    }
    setLoading(false);
  };

  const addLearningTime = async (seconds: number) => {
    if (!user || !isConfigured || seconds <= 0) return;

    setMetrics(prev => ({
      ...prev,
      total_learning_seconds: prev.total_learning_seconds + seconds
    }));

    // In a real production app, we would debounce this or update via RPC to avoid race conditions.
    // For MVP, we'll do a simple direct update. To prevent race conditions, we fetch the latest first.
    const { data: latest } = await supabase
      .from('user_metrics')
      .select('total_learning_seconds')
      .eq('user_id', user.id)
      .single();

    const currentSeconds = latest?.total_learning_seconds || 0;

    await supabase
      .from('user_metrics')
      .update({ total_learning_seconds: currentSeconds + seconds })
      .eq('user_id', user.id);
  };

  useEffect(() => {
    fetchAndProcessMetrics();
  }, [user]);

  return { metrics, loading, addLearningTime };
}

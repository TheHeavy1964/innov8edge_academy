"use client";

import { useState, useEffect } from "react";
import { supabase, isConfigured } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    if (!user || !isConfigured) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data) {
      setProgress(data);
    }
    setLoading(false);
  };

  const updateProgress = async (lessonId: string, percentComplete: number, status: 'in_progress' | 'completed' = 'in_progress') => {
    if (!user || !isConfigured) return;

    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        percent_complete: percentComplete,
        status,
        last_accessed: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' });

    if (!error) {
      fetchProgress();
    }
  };

  const resetTrack = async (lessonIds: string[]) => {
    if (!user || !isConfigured) return;

    const { error } = await supabase
      .from('lesson_progress')
      .delete()
      .eq('user_id', user.id)
      .in('lesson_id', lessonIds);

    if (!error) {
      fetchProgress();
    }
  };

  const resetAllProgress = async () => {
    if (!user || !isConfigured) return;

    const { error } = await supabase
      .from('lesson_progress')
      .delete()
      .eq('user_id', user.id);

    if (!error) {
      setProgress([]);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  return { progress, loading, updateProgress, resetTrack, resetAllProgress, refreshProgress: fetchProgress };
}

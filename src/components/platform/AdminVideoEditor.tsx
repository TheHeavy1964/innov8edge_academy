"use client";

import { useState, useRef } from "react";
import { Pencil, Save, X, Upload, Link2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AdminVideoEditorProps {
  lessonId: string;
  currentUrl: string;
  onSaved: (url: string) => void;
}

type Mode = "url" | "upload";

export default function AdminVideoEditor({ lessonId, currentUrl, onSaved }: AdminVideoEditorProps) {
  const [editing, setEditing] = useState(false);
  const [mode, setMode] = useState<Mode>("url");
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const persistUrl = async (url: string) => {
    await fetch("/api/lesson-videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, videoUrl: url }),
    });
    onSaved(url);
    setSaveSuccess(true);
    setEditing(false);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleSaveUrl = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setIsSaving(true);
    setError(null);
    try {
      await persistUrl(trimmed);
    } catch {
      setError("Failed to save URL. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file (MP4, MOV, WebM).");
      return;
    }
    const maxSize = 50 * 1024 * 1024; // 50MB — Supabase free tier limit
    if (file.size > maxSize) {
      setError(`File is ${(file.size / 1024 / 1024).toFixed(1)}MB — Supabase free tier limits uploads to 50MB. Options: (1) compress your video with HandBrake to under 50MB, (2) upgrade your Supabase plan to Pro for a 5GB limit, or (3) upload to YouTube (unlisted) and paste the URL instead.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const ext = file.name.split(".").pop() || "mp4";
      const fileName = `lesson-${lessonId}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("lesson-videos")
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        if (uploadError.message?.toLowerCase().includes('size') || uploadError.message?.toLowerCase().includes('exceeded')) {
          throw new Error(`Upload blocked by Supabase (50MB free tier limit). Your file may exceed it. Try: compress with HandBrake, upgrade to Supabase Pro, or use YouTube URL instead.`);
        }
        throw new Error(uploadError.message);
      }

      // Simulate progress since supabase-js doesn't expose XHR progress
      for (let i = 10; i <= 90; i += 10) {
        setUploadProgress(i);
        await new Promise(r => setTimeout(r, 150));
      }

      const { data: publicData } = supabase.storage
        .from("lesson-videos")
        .getPublicUrl(fileName);

      setUploadProgress(100);
      await persistUrl(publicData.publicUrl);
    } catch (e: any) {
      setError(e.message || "Upload failed. Check your Supabase Storage bucket permissions.");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  if (!editing) {
    return (
      <div className="space-y-1">
        {saveSuccess && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-green-400 uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3" />
            Video URL saved to database
          </div>
        )}
        <button
          onClick={() => { setUrlInput(currentUrl); setEditing(true); setError(null); }}
          className="flex items-center gap-2 text-[10px] font-bold text-amber-400/70 hover:text-amber-400 transition-colors uppercase tracking-widest"
        >
          <Pencil className="w-3 h-3" />
          Edit Lesson Video URL
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-white/[0.03] border border-amber-400/20 rounded-2xl">
      {/* Mode Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
        {(["url", "upload"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              mode === m
                ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                : "text-[var(--muted)] hover:text-white"
            }`}
          >
            {m === "url" ? <Link2 className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
            {m === "url" ? "Paste URL" : "Upload File"}
          </button>
        ))}
      </div>

      {/* URL Mode */}
      {mode === "url" && (
        <div className="space-y-2">
          <p className="text-[10px] text-[var(--muted)]">
            Supports: YouTube · Vimeo · Google Drive (shared public) · Direct MP4 URL
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or Google Drive link..."
              className="flex-1 bg-white/5 border border-amber-400/40 rounded-xl py-2 px-4 text-sm text-white focus:border-amber-400 outline-none transition-all"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSaveUrl()}
            />
            <button
              onClick={handleSaveUrl}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400 text-xs font-bold hover:bg-amber-400/30 transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--muted)] hover:text-white transition-all shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Mode */}
      {mode === "upload" && (
        <div className="space-y-3">
          <p className="text-[10px] text-[var(--muted)]">
            Upload MP4, MOV, or WebM directly. <span className="text-amber-400/80 font-semibold">Max 50MB</span> (Supabase free tier). For larger files, upload to YouTube and paste the URL.
          </p>

          {isUploading ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                Uploading... {uploadProgress}%
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-amber-400 bg-amber-400/10"
                  : "border-white/10 hover:border-amber-400/40 hover:bg-white/5"
              }`}
            >
              <Upload className="w-8 h-8 text-amber-400/60 mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-1">Drop your video here</p>
              <p className="text-[11px] text-[var(--muted)]">or click to browse · MP4, MOV, WebM · Max 50MB</p>
              <input
                ref={fileRef}
                type="file"
                accept="video/mp4,video/mov,video/webm,video/*"
                onChange={onFileChange}
                className="hidden"
              />
            </div>
          )}

          <button
            onClick={() => setEditing(false)}
            className="text-[10px] font-bold text-[var(--muted)] hover:text-white uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  );
}

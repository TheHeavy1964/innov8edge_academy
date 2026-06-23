"use client";

import { useState, useEffect } from "react";
import { Smartphone, Monitor, X, Smartphone as PhoneIcon, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileToggle() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  const [ip, setIp] = useState("");

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {showPrompt && !showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="glass-strong px-4 py-3 rounded-2xl shadow-2xl border border-[var(--primary)]/30 mb-2 max-w-[240px]"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-[var(--primary-light)] uppercase tracking-wider">Mobile Optimized</span>
              <button onClick={() => setShowPrompt(false)} className="text-[var(--muted)] hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm text-white/90 leading-tight">
              Test how this looks on your phone!
            </p>
            <button 
              onClick={() => setShowQR(true)}
              className="mt-3 w-full py-1.5 bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 rounded-lg text-xs font-semibold text-[var(--primary-light)] transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-3.5 h-3.5" />
              Open Mobile Preview
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-strong p-6 rounded-3xl shadow-2xl border border-[var(--primary)]/50 mb-2 flex flex-col items-center w-[280px]"
          >
            <div className="flex justify-between w-full mb-4">
              <span className="text-sm font-bold text-white">Mobile Preview</span>
              <button onClick={() => setShowQR(false)} className="text-[var(--muted)] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* QR Code Container */}
            <div className="w-44 h-44 bg-white p-3 rounded-2xl mb-4 relative">
              <div 
                className="w-full h-full bg-cover transition-opacity duration-300" 
                style={{ 
                  backgroundImage: `url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://${ip || "localhost"}:3030')` 
                }}
              />
            </div>

            {/* IP Input for Mobile Sync */}
            <div className="w-full mb-4">
              <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 block">
                Local IP Sync
              </label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text"
                  placeholder="e.g. 192.168.1.15"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[var(--primary)]/50 outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`http://${ip || "localhost"}:3030`);
                  }}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                  title="Copy URL"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="space-y-3 p-3 bg-amber-400/5 border border-amber-400/20 rounded-xl">
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-tight">Safari Troubleshooting</p>
                <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                  If Safari says <span className="text-white">"HTTPS-Only enabled"</span>:
                </p>
                <ol className="text-[10px] text-[var(--muted)] space-y-1 list-decimal pl-3">
                  <li>Tap the URL bar and ensure it says <span className="text-white">http://</span> (not https).</li>
                  <li>In Safari Settings, you may need to disable <span className="text-white">"HTTPS-Only Mode"</span> temporarily.</li>
                  <li>For a secure tunnel, run <code className="text-amber-400/80 bg-black/30 px-1 rounded">npx localtunnel --port 3030</code> in your terminal.</li>
                </ol>
              </div>
            </div>
            
            <div className="text-center pt-4 border-t border-white/5 w-full">
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-bold mb-2">Desktop Alternative</p>
              <p className="text-xs text-white/70">
                Resize browser below <span className="text-white font-bold">768px</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setShowQR(!showQR)}
        className="w-14 h-14 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-color)] shadow-2xl flex items-center justify-center text-[var(--primary-light)] hover:scale-110 active:scale-95 transition-all duration-300 hover:border-[var(--primary)]/50 group"
        id="mobile-view-toggle"
        aria-label="Mobile preview options"
      >
        {showQR ? <X className="w-6 h-6 text-white" /> : <Smartphone className="w-6 h-6 group-hover:text-[var(--accent)]" />}
      </button>
    </div>
  );
}

"use client";
// V1 Stability Patch: Standard Fetch Implementation

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  ChevronRight,
  Maximize2,
  Minimize2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useChat } from '@ai-sdk/react';

export default function AITutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm Coach Innov8, your personal AI tutor. I can help you understand AI concepts or guide you through the sandboxes. What's on your mind?",
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getContextInfo = () => {
    if (pathname.includes('/learn/beginner')) return "User is in AI Foundations track.";
    if (pathname.includes('/learn/intermediate')) return "User is in The Automation Stack track.";
    if (pathname.includes('/learn/builder')) return "User is in Agent Engineering track.";
    if (pathname.includes('/learn/business')) return "User is in AI for Business track.";
    if (pathname.includes('/learn/expert')) return "User is in AI Operations (AIOps) track.";
    if (pathname.includes('/sandbox/workflow')) return "User is building a visual workflow.";
    return "User is browsing the platform.";
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput
    };

    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          contextInfo: getContextInfo()
        })
      });

      if (!response.ok) throw new Error("Failed to connect to Coach Innov8");

      // Handle streaming or simple response
      const data = await response.json().catch(() => null);
      
      if (data && data.content) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content
        }]);
      } else {
        const reader = response.body?.getReader();
        if (reader) {
          let assistantContent = "";
          const assistantId = (Date.now() + 1).toString();
          setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: "" }]);
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            assistantContent += decoder.decode(value, { stream: true });
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m));
          }
        }
      }
    } catch (error: any) {
      console.error('Coach Innov8 error:', error);
      setErrorMsg(error.message || 'Coach is temporarily unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[var(--accent)] text-white shadow-2xl shadow-[var(--accent)]/40 flex items-center justify-center z-[9999] hover:scale-110 transition-transform group"
        >
          <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[var(--accent)] rounded-full flex items-center justify-center text-[10px] font-black border-2 border-[var(--accent)] animate-bounce">
            1
          </div>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '600px',
              width: '400px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-[#0D160F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[10000] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20 relative">
                  <Bot className="w-5 h-5 text-[var(--accent)]" />
                  {isLoading && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--accent)] rounded-full animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">Coach Innov8</h3>
                  <p className="text-[10px] text-[var(--accent)] font-medium mt-1 uppercase tracking-tighter">
                    {isLoading ? 'Thinking...' : 'AI Learning Assistant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-xl hover:bg-white/5 text-[var(--muted)] transition-all"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/5 text-[var(--muted)] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                  {messages.map((msg: any) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mr-2 mt-1 shrink-0">
                          <Bot className="w-3.5 h-3.5 text-[var(--accent)]" />
                        </div>
                      )}
                      <div className={`max-w-[80%] ${
                        msg.role === 'user' 
                          ? 'bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-2xl rounded-tr-none' 
                          : 'bg-white/[0.04] border border-white/8 rounded-2xl rounded-tl-none'
                        } p-4`}
                      >
                        <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Loading dots */}
                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex justify-start">
                      <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mr-2 shrink-0">
                        <Bot className="w-3.5 h-3.5 text-[var(--accent)]" />
                      </div>
                      <div className="bg-white/[0.04] border border-white/8 rounded-2xl rounded-tl-none p-4 flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-[var(--accent)]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-[var(--accent)]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-[var(--accent)]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  {/* Error display */}
                  {errorMsg && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300 leading-relaxed">{errorMsg}</p>
                    </div>
                  )}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick prompts */}
                {messages.length <= 1 && (
                  <div className="px-6 pb-3 flex flex-wrap gap-2">
                    {["What is an AI agent?", "How does RAG work?", "Explain MCP simply"].map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => {
                          setChatInput(prompt);
                        }}
                        className="text-[10px] font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[var(--muted)] hover:text-white hover:border-white/20 transition-all"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <form 
                  onSubmit={handleFormSubmit} 
                  className="p-4 border-t border-white/5 bg-white/[0.01] shrink-0"
                >
                  <div className="relative">
                    <input 
                      ref={inputRef}
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask Coach Innov8 anything..."
                      className="w-full bg-black/60 border border-white/20 rounded-2xl pl-5 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition-all placeholder:text-white/30"
                    />
                    <button 
                      type="submit"
                      disabled={isLoading || !chatInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/20 hover:scale-105 transition-all disabled:opacity-40 disabled:hover:scale-100"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

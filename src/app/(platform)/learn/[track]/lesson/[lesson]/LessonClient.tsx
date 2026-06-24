"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProgress } from "@/hooks/useProgress";
import { useMetrics } from "@/hooks/useMetrics";
import { useAuth } from "@/context/AuthContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Zap, 
  CheckCircle2,
  Brain,
  HelpCircle,
  Terminal,
  MessageSquare,
  PanelRightClose,
  PanelRight,
  RotateCcw,
  Sparkles,
  X,
  Pencil,
  Save
} from "lucide-react";
import { Lesson } from "@/types/lesson";
import AdminVideoEditor from "@/components/platform/AdminVideoEditor";

// Convert any video URL to a proper embed URL
function toEmbedUrl(url: string): string {
  if (!url) return "";
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  return url;
}

interface LessonClientProps {
  lesson: Lesson;
  trackId: string;
}

export default function LessonClient({ lesson, trackId }: LessonClientProps) {
  const router = useRouter();
  const { updateProgress } = useProgress();
  const { isAdmin } = useAuth();
  const [sandboxOpen, setSandboxOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("theory");
  const [humanMode, setHumanMode] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [sandboxInput, setSandboxInput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [sandboxTrace, setSandboxTrace] = useState<string[]>([]);
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);
  const { addLearningTime } = useMetrics();

  // Admin video management
  const [liveVideoUrl, setLiveVideoUrl] = useState("");

  // Track active learning time
  useEffect(() => {
    const interval = setInterval(() => {
      addLearningTime(60);
    }, 60000);
    return () => clearInterval(interval);
  }, [addLearningTime]);

  // Fetch persisted video URL from Supabase on mount
  useEffect(() => {
    async function fetchVideoUrl() {
      try {
        const res = await fetch(`/api/lesson-videos?lessonId=${lesson.id}`);
        const json = await res.json();
        if (json.data?.video_url) {
          setLiveVideoUrl(json.data.video_url);
        } else {
          setLiveVideoUrl((lesson as any).videoUrl || "");
        }
      } catch {
        setLiveVideoUrl((lesson as any).videoUrl || "");
      }
    }
    fetchVideoUrl();
  }, [lesson.id]);


  // Function to select and shuffle questions
  const initializeQuiz = () => {
    if (!lesson.quiz || lesson.quiz.length === 0) return;
    
    // Shuffle the entire pool
    const shuffled = [...lesson.quiz].sort(() => Math.random() - 0.5);
    // Take the first 5 (or fewer if total pool is smaller)
    setCurrentQuestions(shuffled.slice(0, 5));
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  // Initialize questions on first load or when tab changes to quiz
  useState(() => {
    initializeQuiz();
  });

  const handleComplete = async () => {
    setIsCompleting(true);
    await updateProgress(lesson.id, 100, 'completed');
    // For demo purposes, we redirect back to the track page
    router.push(`/learn/${trackId}`);
  };

  const clearSandbox = () => {
    setSandboxInput("");
    setSandboxTrace([]);
    setSandboxOutput(null);
    setIsSimulating(false);
  };

  const runSimulation = () => {
    if (!sandboxInput) return;
    setIsSimulating(true);
    setSandboxOutput(null);
    setSandboxTrace(["[AGENT] Initializing neural bridge...", "[SYSTEM] Active Protocol: " + lesson.title]);

    const getSimulationData = () => {
      const input = sandboxInput.toLowerCase();
      
      if (lesson.id === '1') {
        let output = "Artificial Intelligence is the simulation of human intelligence by machines. I am currently using probabilistic reasoning to generate this response for you! 🤖";
        let steps = [
          "Parsing query patterns...",
          "Mapping request to probabilistic model...",
          "HEURISTIC: Determining if this requires strict logic or pattern matching...",
          "DECISION: Applying pattern-based reasoning.",
          "Result: Generated response based on high-dimensional data training."
        ];

        if (input.includes('useful') || input.includes('benefit')) {
          output = "AI is useful because it automates complex pattern recognition. It can scan millions of records, find trends humans miss, and provide predictions in milliseconds. In this academy, you'll learn to harness that for business operations!";
          steps[2] = "HEURISTIC: Analyzing utility and business value...";
        } else if (input.includes('data') || input.includes('learn')) {
          output = "Great observation! AI 'learns' by adjusting internal weights based on data. Unlike traditional code which uses 'If/Then' rules, AI uses 'Weights & Biases' to find the most likely answer.";
          steps[3] = "ANALYSIS: Identifying training data correlations...";
        } else if (input.includes('reasoning') || input.includes('think')) {
          output = "Probabilistic reasoning is the AI's way of 'guessing' the next most likely token based on patterns in its training data. It doesn't follow a fixed script; it calculates probabilities.";
          steps[3] = "DECISION: Calculating token probabilities...";
        } else if (input.includes('neural') || input.includes('brain')) {
          output = "Neural networks are inspired by the human brain's structure. They consist of layers of 'neurons' (math functions) that process information. You're currently interacting with a simulated version of one!";
          steps[0] = "SIGNAL: Activating simulated neural pathways...";
        }
        
        return { steps, output };
      }

      if (lesson.id === '3') {
        let output = "I have analyzed your prompt using the 'Perfect Prompt Formula'. By defining a clear Role, Task, and Context, I can generate a response that is significantly more precise than a standard query. ✨";
        let steps = [
          "Identifying Persona: Agent Expert",
          "Analyzing prompt structure...",
          "Applying 'Perfect Prompt Formula'...",
          "Expanding constraints...",
          "Refining tone..."
        ];

        if (input.includes('email') || input.includes('write')) {
          output = "Subject: Meet Aria—Your New Autonomous Sales Assistant 🚀\n\nHi Team,\n\nWe are thrilled to unveil Aria, our latest agentic automation. Aria uses advanced reasoning to research prospects and draft personalized outreach.\n\nReady to scale? Let's go! \n\nBest, \nThe Innov8Edge Team";
          steps[0] = "Identifying Persona: Marketing Specialist";
        } else if (input.includes('speech') || input.includes('talk')) {
          output = "Dear Graduates, today you are no longer just users of AI; you are the architects of it. The agents you build today will define the efficiency of the world tomorrow. Go forth with curiosity and lead with ethics! 🎓✨";
          steps[0] = "Identifying Persona: Keynote Speaker";
        } else if (input.includes('role') || input.includes('persona')) {
          output = "By giving me a 'Role' (like 'Expert Chef' or 'Legal Analyst'), you narrow my focus. This reduces 'hallucinations' because I'm only looking for patterns relevant to that specific professional persona.";
          steps[2] = "FORMULA: Prioritizing Role-based constraints...";
        }

        return { steps, output };
      }

      if (lesson.id === '5') {
        const isFiles = input.includes('file') || input.includes('list');
        const isSecurity = input.includes('safe') || input.includes('security') || input.includes('permission');
        
        return {
          steps: [
            "Searching for active MCP Servers...",
            `FOUND: MCP-Server-FileSystem`,
            "HANDSHAKE: Requesting tool definitions...",
            isFiles ? "FS_SCAN: Reading directory structure..." : "HANDSHAKE: Authenticating connection...",
            isSecurity ? "AUTH: Checking policy 'read_only'..." : "EXECUTION: Sending JSON-RPC request...",
            "RECEIPT: Data received via MCP bridge."
          ],
          output: isFiles 
            ? "Successfully listed project files via MCP: \n\n📁 Root:\n- src/lib/lessons.ts\n- src/app/page.tsx\n- .env.local (Protected)\n\nThe bridge is authorized for read-only access. 🔌"
            : isSecurity 
            ? "Security Check: The MCP bridge uses token-based authentication. Tools like 'read_file' are restricted by your local system permissions. The AI can only see what you explicitly allow. 🔐"
            : "Successfully established a secure handshake with your local environment via MCP. The bridge is stable (12ms latency) and ready for cross-app commands. 🔌"
        };
      }

      if (lesson.id === '7') {
        const isVacation = input.includes('vacation') || input.includes('holiday') || input.includes('pto');
        const isSearch = input.includes('search') || input.includes('find') || input.includes('where');

        return {
          steps: [
            "Generating vector embedding...",
            "SEARCHING: Querying Vector Database...",
            isSearch ? "MATCH: Found 85% similarity in 'Knowledge_Base.pdf'" : "RETRIEVED: Found relevant chunks...",
            "AUGMENTING: Injecting context into system prompt...",
            "GENERATING: Synthesizing grounded answer."
          ],
          output: isVacation
            ? "According to the HR manual (Section 4.2.1), our policy allows for unlimited PTO, provided that project milestones are met. I've verified this directly from the source to avoid hallucinations. 📚"
            : isSearch
            ? "I've searched your knowledge base and found relevant documentation regarding your request. By using RAG (Retrieval Augmented Generation), I'm making sure my answer is grounded in your specific data. 🧠"
            : "I have successfully retrieved 3 relevant document chunks. I am using this 'external knowledge' to answer your question, which is much more reliable than relying on my general training alone! 📚"
        };
      }

      if (lesson.id === '8') {
        return {
          steps: [
            "Parsing intent for tool requirements...",
            "SCHEMA_MATCH: Checking tool definitions...",
            input.includes('run') ? "SELECTED_TOOL: execute_command()" : "SELECTED_TOOL: analyze_data()",
            `CONSTRUCTING_JSON: { "action": "run", "params": { "cmd": "${input}" } }`,
            "RESPONSE_PARSING: Integrating output."
          ],
          output: `Tool Call Executed: [${input}]. By defining a clear JSON schema for my tools, I can translate your plain-English request into a precise technical action. 🚀`
        };
      }

      return {
        steps: [
          `Analyzing request: "${sandboxInput}"`,
          "Identifying relevant tools...",
          "Executing sub-task: Reasoning...",
          "Finalizing response."
        ],
        output: "Simulation complete. I've processed your request based on the current lesson's logic. How else can I help you practice?"
      };
    };

    const { steps, output } = getSimulationData();
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setSandboxTrace(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setSandboxOutput(output);
        setIsSimulating(false);
      }
    }, 800);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden">
      {/* Left: Content Area */}
      <motion.div 
        layout
        className="flex-1 glass-strong rounded-3xl border border-[var(--border-color)] flex flex-col overflow-hidden"
      >
        {/* Lesson Navigation Header */}
        <div className="h-16 px-6 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Link 
              href={`/learn/${trackId}`}
              className="text-[var(--muted)] hover:text-white flex items-center gap-2 text-sm font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Path
            </Link>
            <div className="w-[1px] h-4 bg-[var(--border-color)]" />
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              {lesson.title}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowHelp(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-white hover:bg-white/5"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setSandboxOpen(!sandboxOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-white hover:bg-white/5"
            >
              {sandboxOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex px-6 pt-6 gap-6 border-b border-[var(--border-color)] shrink-0">
          {["theory", "examples", "quiz"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab ? "text-white" : "text-[var(--muted)] hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Text Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="badge !bg-[rgba(76,187,23,0.1)] !border-[rgba(76,187,23,0.2)] !text-[var(--accent)]">
                <Brain className="w-3.5 h-3.5" />
                Explain Like I'm Human
              </div>
              <button 
                onClick={() => setHumanMode(!humanMode)}
                className={`relative w-10 h-5 rounded-full transition-colors ${humanMode ? 'bg-[var(--accent)]' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${humanMode ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">
              {activeTab === 'theory' && (humanMode ? "The Simple Version" : lesson.title)}
              {activeTab === 'examples' && "Real-World Examples"}
              {activeTab === 'quiz' && "Knowledge Check"}
            </h1>
            
            <div className="prose prose-invert max-w-none space-y-6">
              {activeTab === 'theory' && (
                  humanMode ? (
                    <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-2xl p-6 italic text-[var(--accent)]">
                       {lesson.humanModeContent || "I haven't written the 'Simple' version for this lesson yet, but it's coming soon!"}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Video Player */}
                      <div className="rounded-[28px] overflow-hidden border border-white/10 bg-black aspect-video relative shadow-2xl">
                        {liveVideoUrl ? (
                          liveVideoUrl.toLowerCase().includes('.mp4') ? (
                            <video
                              key={liveVideoUrl}
                              src={liveVideoUrl}
                              controls
                              playsInline
                              className="absolute inset-0 w-full h-full object-contain bg-black"
                            />
                          ) : (
                            <iframe
                              key={liveVideoUrl}
                              src={toEmbedUrl(liveVideoUrl)}
                              className="absolute inset-0 w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                              allowFullScreen
                              title="Lesson Video"
                            />
                          )
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 pointer-events-none">
                          <div className="badge !bg-black/60 backdrop-blur-md !border-white/10 text-white">
                            <Play className="w-3 h-3 fill-white" />
                            Lesson Video
                          </div>
                        </div>
                      </div>

                      {/* Admin: Video editor with upload + URL support */}
                      {isAdmin && (
                        <AdminVideoEditor
                          lessonId={lesson.id}
                          currentUrl={liveVideoUrl}
                          onSaved={(url) => setLiveVideoUrl(url)}
                        />
                      )}

                      {/* Lesson Text Content (preserved as-is) */}
                      <div className="text-[var(--muted)] leading-relaxed whitespace-pre-wrap">
                        {lesson.content}
                      </div>
                    </div>
                  )
                )}

              {activeTab === 'examples' && (
                <div className="text-[var(--muted)] leading-relaxed whitespace-pre-wrap">
                  {lesson.examples || "No examples available for this lesson yet."}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-8 pb-20">
                  {currentQuestions.length > 0 ? (
                    <>
                      {currentQuestions.map((q, idx) => {
                        const isCorrect = quizAnswers[idx] === q.correctAnswer;
                        const isWrong = quizSubmitted && quizAnswers[idx] !== undefined && quizAnswers[idx] !== q.correctAnswer;
                        
                        return (
                          <div key={idx} className={`glass-strong border rounded-2xl p-6 transition-all ${
                            quizSubmitted 
                              ? (isCorrect ? 'border-[var(--accent)]/50 bg-[var(--accent)]/5' : (isWrong ? 'border-red-500/50 bg-red-500/5' : 'border-white/5')) 
                              : 'border-white/5'
                          }`}>
                            <h3 className="text-white font-bold mb-4">{idx + 1}. {q.question}</h3>
                            <div className="grid grid-cols-1 gap-3">
                              {q.options.map((option: any, optIdx: number) => (
                                <button 
                                  key={optIdx}
                                  disabled={quizSubmitted}
                                  onClick={() => setQuizAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                                  className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-medium ${
                                    quizAnswers[idx] === optIdx 
                                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-white' 
                                      : 'border-white/10 text-[var(--muted)] hover:border-white/20 hover:bg-white/5'
                                  } ${
                                    quizSubmitted && optIdx === q.correctAnswer ? '!border-[var(--accent)] !bg-[var(--accent)]/20 !text-white' : ''
                                  } ${
                                    quizSubmitted && quizAnswers[idx] === optIdx && optIdx !== q.correctAnswer ? '!border-red-500 !bg-red-500/20' : ''
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                            
                            {quizSubmitted && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-6 p-4 rounded-xl text-xs leading-relaxed ${isCorrect ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-red-500/10 text-red-400'}`}
                              >
                                <span className="font-bold uppercase tracking-wider block mb-1">
                                  {isCorrect ? 'Correct!' : 'Incorrect'}
                                </span>
                                {q.explanation}
                              </motion.div>
                            )}
                          </div>
                        );
                      })}

                      {!quizSubmitted && (
                        <button 
                          onClick={() => setQuizSubmitted(true)}
                          disabled={Object.keys(quizAnswers).length < currentQuestions.length}
                          className="w-full py-4 rounded-2xl bg-[var(--accent)] text-white font-bold shadow-lg shadow-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          Submit Knowledge Check
                        </button>
                      )}

                      {quizSubmitted && (
                        <div className="text-center p-8 glass-strong rounded-3xl border border-[var(--accent)]/30">
                          <CheckCircle2 className="w-12 h-12 text-[var(--accent)] mx-auto mb-4" />
                          <h4 className="text-xl font-bold text-white mb-2">Quiz Complete!</h4>
                          <p className="text-sm text-[var(--muted)] mb-6">
                            You scored {Object.entries(quizAnswers).filter(([idx, ans]) => ans === currentQuestions[Number(idx)].correctAnswer).length} out of {currentQuestions.length}
                          </p>
                          <button 
                            onClick={initializeQuiz}
                            className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest hover:underline"
                          >
                            Retake Quiz (Randomized Pool)
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-[var(--muted)]">No quiz available for this lesson yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="h-20 px-8 border-t border-[var(--border-color)] flex items-center justify-between bg-white/[0.02] shrink-0">
          <button className="flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`w-8 h-1 rounded-full ${i <= 1 ? 'bg-[var(--accent)]' : 'bg-white/10'}`} />
            ))}
          </div>

          <button 
            onClick={handleComplete}
            disabled={isCompleting}
            className="btn-primary !py-2.5 !px-6 !text-sm group disabled:opacity-50"
          >
            {isCompleting ? "Saving..." : "Complete & Next"}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Right: Sandbox Area */}
      <AnimatePresence>
        {sandboxOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "45%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col gap-6 h-full"
          >
            {/* Real-time Sandbox */}
            <div className="flex-1 glass-strong rounded-3xl border border-[var(--accent)]/30 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(76,187,23,0.05)]">
              <div className="h-12 px-5 border-b border-[var(--border-color)] bg-[var(--accent)]/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">Live Playground</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearSandbox}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-[var(--muted)] hover:text-white hover:border-white/10 transition-all uppercase tracking-wider"
                    title="Clear Sandbox"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> Reset
                  </button>
                  <div className="w-[1px] h-3 bg-white/10 mx-1" />
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                    <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Sandbox Ready</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-hide">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Test Environment</label>
                  <div className="bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-xl p-4 text-xs font-mono text-white/60">
                    // Welcome to the {lesson.title} Sandbox.<br/>
                    // practice {lesson.title.toLowerCase()} concepts here.
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Input Command</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={sandboxInput}
                      onChange={(e) => setSandboxInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && runSimulation()}
                      className="w-full bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-xl p-4 pr-12 text-sm text-white font-mono focus:border-[var(--accent)] outline-none transition-all"
                      placeholder="Type a command to simulate AI logic..."
                    />
                    <button 
                      onClick={runSimulation}
                      disabled={isSimulating || !sandboxInput}
                      className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/20 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
                    >
                      {isSimulating ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 fill-white" />
                      )}
                    </button>
                  </div>
                </div>

                {sandboxTrace.length === 0 && !isSimulating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3 pt-4"
                  >
                    <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Try a Demo Prompt</div>
                    <div className="grid grid-cols-1 gap-2">
                      {lesson.id === '1' && [
                        "Explain probabilistic reasoning.",
                        "Difference between AI and standard code.",
                        "What is a neural network?"
                      ].map((demo, i) => (
                        <button 
                          key={i}
                          onClick={() => setSandboxInput(demo)}
                          className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[var(--muted)] hover:text-white hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all"
                        >
                          {demo}
                        </button>
                      ))}
                      {lesson.id === '3' && [
                        "Write a commencement speech for AI builders.",
                        "Draft a product launch email for a new agent.",
                        "Create a motivational post about automation."
                      ].map((demo, i) => (
                        <button 
                          key={i}
                          onClick={() => setSandboxInput(demo)}
                          className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[var(--muted)] hover:text-white hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all"
                        >
                          {demo}
                        </button>
                      ))}
                      {lesson.id === '5' && [
                        "List files in the current project.",
                        "Get tool definitions from MCP Server.",
                        "Simulate an MCP handshake."
                      ].map((demo, i) => (
                        <button 
                          key={i}
                          onClick={() => setSandboxInput(demo)}
                          className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[var(--muted)] hover:text-white hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all"
                        >
                          {demo}
                        </button>
                      ))}
                      {lesson.id === '7' && [
                        "Search the HR manual for vacation policy.",
                        "Perform a vector search on 'Project_Specs.pdf'.",
                        "Augment this prompt with document context."
                      ].map((demo, i) => (
                        <button 
                          key={i}
                          onClick={() => setSandboxInput(demo)}
                          className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[var(--muted)] hover:text-white hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all"
                        >
                          {demo}
                        </button>
                      ))}
                      {lesson.id === '8' && [
                        "Run the 'build' command.",
                        "Initialize a new agent squad.",
                        "Call the 'execute_task' tool."
                      ].map((demo, i) => (
                        <button 
                          key={i}
                          onClick={() => setSandboxInput(demo)}
                          className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[var(--muted)] hover:text-white hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all"
                        >
                          {demo}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="pt-4 border-t border-[var(--border-color)]">
                  <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-3">Live Trace</div>
                  <div className="space-y-2">
                    {sandboxTrace.length > 0 ? (
                      sandboxTrace.map((step, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-3 text-xs font-mono"
                        >
                          <span className="text-[var(--accent)] shrink-0">[{idx + 1}]</span>
                          <span className={idx === sandboxTrace.length - 1 && isSimulating ? "text-white animate-pulse" : "text-[var(--muted)]"}>
                            {step}
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-[var(--muted)] font-mono leading-relaxed italic">
                        Simulation output will appear here...
                      </div>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {sandboxOutput && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-6 border-t border-[var(--border-color)] mt-4"
                    >
                      <div className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3" /> Agent Response
                        </div>
                        <button 
                          onClick={() => setSandboxOutput(null)}
                          className="p-1 rounded hover:bg-white/5 text-[var(--muted)] hover:text-white transition-all"
                          title="Clear Response"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="p-5 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 text-sm text-white/90 leading-relaxed font-medium">
                        {sandboxOutput}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Reset Button */}
                {(sandboxTrace.length > 0 || sandboxInput) && (
                  <div className="pt-8 flex justify-center pb-4">
                    <button 
                      onClick={clearSandbox}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/5 bg-white/5 text-[10px] font-bold text-[var(--muted)] hover:text-white hover:bg-white/10 hover:border-white/10 transition-all uppercase tracking-widest"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Clear Sandbox Data
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AI Tutor Mini-widget */}
            <div 
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-tutor'))}
              className="h-32 glass-strong rounded-3xl border border-white/10 p-5 flex items-center gap-5 relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--hunter-green)] flex items-center justify-center shrink-0 border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-white mb-1">Coach Innov8</div>
                <p className="text-xs text-[var(--muted)] leading-tight">
                  Need a hand with {lesson.title}? I'm here to help you get started with the basics!
                </p>
                <div className="mt-2 text-[10px] font-bold text-[var(--primary-light)] uppercase tracking-widest flex items-center gap-1">
                  Chat Now <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg glass-strong border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-[var(--accent)]" />
                Lesson Guide
              </h2>
              <div className="space-y-4 text-[var(--muted)]">
                <p>Welcome to the <b>{lesson.title}</b> lesson! Here is how to make the most of this page:</p>
                <ul className="space-y-2 list-disc pl-5">
                  <li><b>Theory:</b> Dive into the core concepts and fundamental logic.</li>
                  <li><b>Examples:</b> See how these concepts are applied in real-world business scenarios.</li>
                  <li><b>Quiz:</b> Test your knowledge with a randomized pool of questions.</li>
                  <li><b>ELI-Human:</b> Use the toggle to switch to a simplified, non-technical explanation.</li>
                  <li><b>Live Sandbox:</b> Practice what you learn in real-time on the right pane.</li>
                </ul>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="mt-8 w-full btn-primary !py-3"
              >
                Got it, let's learn!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

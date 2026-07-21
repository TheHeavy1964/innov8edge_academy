/// <reference types="chrome"/>
import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { LogOut, Camera, ChevronLeft, Check, X } from 'lucide-react'
import { CHECKLISTS } from '../lib/checklists'

export default function QACompanion({ session }: { session: Session }) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  
  // Store local checklist state: Record<taskId, 'pass' | 'fail' | null>
  const [results, setResults] = useState<Record<string, 'pass' | 'fail' | null>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [screenshots, setScreenshots] = useState<Record<string, string>>({})

  const activeProject = CHECKLISTS.find(p => p.id === activeProjectId)

  const handleResult = (id: string, status: 'pass' | 'fail') => {
    setResults(prev => ({ 
      ...prev, 
      [id]: prev[id] === status ? null : status 
    }))
  }

  const handleNoteChange = (id: string, note: string) => {
    setNotes(prev => ({ ...prev, [id]: note }))
  }

  const handleCaptureBug = async (taskId?: string) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        // Query the active tab in the current window to ensure we have context
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length === 0) {
            alert("Could not detect an active tab.");
            return;
          }
          
          const activeTab = tabs[0];
          if (activeTab.url?.startsWith('chrome://')) {
            alert("Chrome restricts extensions from taking screenshots of 'chrome://' pages (like the Extensions page). Please go to Innov8Edge Academy or Meal Genie to test the screenshot tool!");
            return;
          }

          chrome.tabs.captureVisibleTab(
            activeTab.windowId, 
            { format: 'png', quality: 100 }, 
            (dataUrl: string) => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert(`Capture Failed: ${chrome.runtime.lastError.message}`);
                return;
              }
              if (taskId) {
                setScreenshots(prev => ({ ...prev, [taskId]: dataUrl }));
              }
            }
          );
        });
      } else {
        alert("Chrome Tabs API not available. Are you running this as an unpacked extension?");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while capturing the screen.");
    }
  }

  const removeScreenshot = (taskId: string) => {
    setScreenshots(prev => {
      const copy = { ...prev };
      delete copy[taskId];
      return copy;
    });
  }
  
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-ia-blue border-b border-ia-blue px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-2">
          <img src="/IA_logo.png" alt="IA Logo" className="h-6 w-auto object-contain" />
          <h1 className="font-bold text-white text-sm">QA Companion</h1>
        </div>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 bg-[#F4F7F9]">
        {!activeProject ? (
          <div>
            <div className="mb-6">
              <p className="text-xs text-ia-blue/70 font-medium mb-1 uppercase">Logged In As</p>
              <p className="text-sm text-ia-blue font-semibold truncate">{session.user.email}</p>
            </div>
            
            <h2 className="text-sm font-bold text-ia-blue mb-3">Select a Project to Test</h2>
            <div className="space-y-3">
              {CHECKLISTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActiveProjectId(p.id)}
                  className="w-full text-left p-4 bg-white border border-ia-blue/20 rounded-xl shadow-sm hover:border-ia-blue hover:shadow-md transition-all group"
                >
                  <div className="font-semibold text-ia-blue group-hover:text-ia-green transition-colors">{p.name}</div>
                  <div className="text-xs text-ia-blue/60 mt-1">Load QA Checklist</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="pb-24">
            <div className="flex items-center gap-2 mb-6">
              <button 
                onClick={() => setActiveProjectId(null)}
                className="text-ia-blue/70 hover:text-ia-blue p-1 rounded-md hover:bg-ia-blue/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-sm font-bold text-ia-blue flex-1 truncate">
                {activeProject.name}
              </h2>
            </div>
            
            <div className="space-y-6">
              {activeProject.sections.map((section, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-ia-blue/20 shadow-sm overflow-hidden">
                  <div className="bg-ia-blue/5 px-4 py-2 border-b border-ia-blue/10">
                    <h3 className="text-xs font-bold text-ia-blue">{section.title}</h3>
                  </div>
                  <div className="divide-y divide-ia-blue/10">
                    {section.items.map(item => (
                      <div key={item.id} className="p-4">
                        <p className="text-sm text-slate-800 mb-3">{item.text}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResult(item.id, 'pass')}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                              results[item.id] === 'pass' 
                                ? 'bg-ia-green text-white border-ia-green' 
                                : 'bg-white border-ia-blue/20 text-ia-blue hover:bg-ia-green/10 hover:text-ia-green hover:border-ia-green/30'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" /> Pass
                          </button>
                          <button
                            onClick={() => handleResult(item.id, 'fail')}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                              results[item.id] === 'fail' 
                                ? 'bg-red-500 text-white border-red-500' 
                                : 'bg-white border-ia-blue/20 text-ia-blue hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" /> Fail
                          </button>
                        </div>
                        
                        {/* Conditional Failure Note UI */}
                        {results[item.id] === 'fail' && (
                          <div className="mt-3 bg-red-50/50 p-3 rounded-lg border border-red-100">
                            <label className="block text-xs font-semibold text-red-800 mb-1">Failure Details</label>
                            <textarea
                              value={notes[item.id] || ''}
                              onChange={(e) => handleNoteChange(item.id, e.target.value)}
                              placeholder="Explain what broke and steps to reproduce..."
                              className="w-full text-sm p-2 rounded-md border border-red-200 outline-none focus:ring-2 focus:ring-red-400 bg-white mb-2 min-h-[80px]"
                            />
                            
                            {screenshots[item.id] ? (
                              <div className="relative mb-2 border border-slate-200 rounded-md overflow-hidden bg-slate-900">
                                <img src={screenshots[item.id]} alt="Bug Screenshot" className="w-full h-auto max-h-40 object-contain opacity-90" />
                                <button 
                                  onClick={() => removeScreenshot(item.id)}
                                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-lg"
                                  title="Remove Screenshot"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-1 left-2 text-[10px] text-white font-medium bg-black/50 px-1.5 py-0.5 rounded">Screenshot Attached</div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleCaptureBug(item.id)}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-xs font-medium transition-colors shadow-sm"
                              >
                                <Camera className="w-4 h-4" />
                                Capture Active Tab Screenshot
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 flex flex-col items-center gap-2 shrink-0">
        <img src="/logo.png" alt="Innov8Edge Logo" className="h-8 object-contain opacity-80" />
        <a
          href="/privacy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-ia-blue/50 hover:text-ia-blue underline underline-offset-2 transition-colors"
        >
          Privacy Policy
        </a>
      </footer>
    </div>
  )
}

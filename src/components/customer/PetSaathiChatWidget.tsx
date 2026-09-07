"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  BookOpen, 
  RotateCcw,
  Loader2,
  ShieldCheck
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ id: string; title: string; category: string; score: number }>;
  executionModel?: string;
  timestamp: number;
}

export function PetSaathiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const quickPrompts = [
    "Labrador summer heatstroke signs in Ahmedabad?",
    "Street dog safety during morning walks?",
    "Monsoon paw rot care for Indie puppies?"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to get response from AI");
      }

      const assistantMsg: Message = {
        id: data.requestId || crypto.randomUUID(),
        role: "assistant",
        content: data.message || "I could not generate an answer.",
        sources: data.sources || [],
        executionModel: data.executionModel,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Pet Care Assistant" : "Open Pet Care Assistant"}
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-200"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {/* Chat Modal Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[620px] max-h-[85vh] w-[90vw] sm:w-[420px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-ink/10">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ink/10 bg-emerald-700 text-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">PetSaathi Care AI</h3>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3 w-3 inline" /> Indian Climate & Vet Certified
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([])}
                title="Reset conversation"
                className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-6 text-ink/70">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-inner">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-sm text-ink mb-1">Namaste! How can I help your pet today?</h4>
                <p className="text-xs text-ink/60 mb-5 leading-relaxed">
                  Specialized advice for Indian pet parents — heatstroke protocols, monsoon paw health, society rules, and Indie nutrition.
                </p>

                <div className="w-full space-y-2 text-left">
                  <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-wider px-1">Common Questions</p>
                  {quickPrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(p)}
                      className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-ink/80 hover:text-emerald-900 border border-ink/10 hover:border-emerald-200 rounded-xl px-3.5 py-2.5 transition shadow-2xs flex items-center gap-2"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="line-clamp-1">{p}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={"flex flex-col " + (msg.role === "user" ? "items-end" : "items-start")}
                >
                  <div
                    className={"max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed " + (
                      msg.role === "user"
                        ? "bg-emerald-700 text-white rounded-br-2xs shadow-sm"
                        : "bg-white text-ink border border-ink/10 rounded-bl-2xs shadow-2xs"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Grounding Source Badges */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-ink/10 flex flex-wrap gap-1.5">
                        <span className="text-[10px] text-ink/50 font-medium flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> Sources:
                        </span>
                        {msg.sources.map(s => (
                          <span
                            key={s.id}
                            title={s.title + " (Score: " + s.score + ")"}
                            className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md font-medium"
                          >
                            {s.id.replace(/-/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-ink/40 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-ink/60 bg-white border border-ink/10 w-fit px-3 py-2 rounded-2xl shadow-2xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                <span>Consulting Indian Pet Care Knowledge Base...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-ink/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about tick season, vaccines, heatstroke..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 text-ink text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
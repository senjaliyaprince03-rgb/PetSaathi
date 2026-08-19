"use client";

import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';

export function GlobalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        aria-expanded={isOpen}
        aria-controls="global-chat-panel"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-coral text-paper shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-2"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div 
          id="global-chat-panel"
          className="fixed bottom-24 right-4 z-50 flex h-[600px] max-h-[calc(100vh-8rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-paper shadow-2xl sm:right-6 sm:w-[400px] border border-indigo/10"
        >
          <div className="flex items-center justify-between border-b border-indigo/10 bg-indigo/5 p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo" />
              <h2 className="font-display font-semibold text-ink">PetSaathi Assistant</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-ink/50 transition hover:bg-indigo/10 hover:text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden relative">
             <ChatWindow />
          </div>
        </div>
      )}
    </>
  );
}

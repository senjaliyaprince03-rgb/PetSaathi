'use client';

import React, { useRef, useEffect } from 'react';
import { useAIChat } from '../../lib/ai/client-state';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export function ChatWindow() {
  const { messages, isLoading, error, sendMessage } = useAIChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-background border rounded-xl overflow-hidden shadow-sm">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
            <div className="max-w-md space-y-2">
              <h3 className="text-lg font-medium text-foreground">Welcome to PetSaathi AI</h3>
              <p>Ask me anything about pet care, finding adoption centers, or managing your pet&apos;s health.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col pb-4" aria-live="polite" aria-relevant="additions text">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {/* Phase 7A: Basic loading indicator while awaiting non-streaming response */}
            {isLoading && (
              <div className="bg-muted/50 px-4 py-6 md:px-6 lg:px-8 text-sm text-muted-foreground flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Thinking...</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 border-t border-destructive/20">
          {error}
        </div>
      )}

      <div className="mt-auto">
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

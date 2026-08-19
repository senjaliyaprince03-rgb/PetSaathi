import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, Conversation } from '../types/ai';
import { mapAIError } from './error-mapper';

export function useAIChat(initialConversationId?: string) {
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationId,
          stream: true
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        let errStr = 'Failed to fetch response';
        try {
          const errData = await response.json();
          errStr = errData.error || errStr;
        } catch(e) {}
        throw new Error(errStr);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream not supported");
      
      const decoder = new TextDecoder();
      const assistantId = crypto.randomUUID();
      
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        toolActivity: [],
        timestamp: Date.now(),
        isStreaming: true
      };

      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n');
        
        let currentEvent: string | null = null;
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.substring(7).trim();
          } else if (line.startsWith('data: ')) {
            const dataStr = line.substring(6).trim();
            if (!dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              
              setMessages(prev => prev.map(msg => {
                if (msg.id !== assistantId) return msg;
                
                const updated = { ...msg };
                
                if (currentEvent === 'text') {
                  updated.content += data.content;
                } else if (currentEvent === 'tool_start') {
                  updated.toolActivity = [...(updated.toolActivity || []), {
                    toolName: data.toolName,
                    status: 'running',
                    startedAt: Date.now()
                  }];
                } else if (currentEvent === 'tool_end') {
                  updated.toolActivity = (updated.toolActivity || []).map(t => 
                    t.toolName === data.toolName && t.status === 'running' 
                      ? { ...t, status: data.result === 'success' ? 'completed' : 'failed' }
                      : t
                  );
                } else if (currentEvent === 'done') {
                  updated.isStreaming = false;
                  if (!conversationId && data.conversationId) {
                    setConversationId(data.conversationId);
                  }
                } else if (currentEvent === 'error') {
                  updated.error = mapAIError(data.error);
                  updated.isStreaming = false;
                }
                
                return updated;
              }));
            } catch (e) {
              console.error("Failed to parse SSE data", line);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Request cancelled');
        return;
      }
      console.error(err);
      setError(mapAIError(err.message));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [conversationId]);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(undefined);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    cancelRequest,
    clearChat,
    conversationId
  };
}

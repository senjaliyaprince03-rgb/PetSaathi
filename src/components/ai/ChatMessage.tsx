import React, { memo } from 'react';
import type { ChatMessage as ChatMessageType } from '../../lib/types/ai';
import { cn } from '../../lib/cn';
import { User, Bot, AlertCircle, Wrench, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "group relative flex w-full gap-4 px-4 py-6 md:px-6 lg:px-8",
      isUser ? "bg-background" : "bg-muted/50"
    )}>
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden px-1">
        {message.toolActivity && message.toolActivity.length > 0 && (
          <div className="flex flex-col gap-1 mb-2">
            {message.toolActivity.map((tool, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 w-fit px-2 py-1 rounded-md">
                {tool.status === 'running' ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : tool.status === 'completed' ? (
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
                <Wrench className="h-3 w-3" />
                <span className="capitalize">{tool.toolName.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="prose prose-sm md:prose-base dark:prose-invert break-words">
          {message.content}
        </div>
        
        {message.error && (
          <div className="flex items-center gap-2 text-sm text-destructive mt-2">
            <AlertCircle className="h-4 w-4" />
            <span>{message.error}</span>
          </div>
        )}
      </div>
    </div>
  );
});

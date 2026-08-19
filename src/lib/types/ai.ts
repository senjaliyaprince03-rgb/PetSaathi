export type MessageRole = 'user' | 'assistant' | 'system';

export interface Citation {
  id: string;
  source: string;
  url?: string;
  title?: string;
  chunk?: string;
}

export interface ToolActivity {
  toolName: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: number;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  toolActivity?: ToolActivity[];
  timestamp: number;
  error?: string;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

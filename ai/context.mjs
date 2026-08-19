/**
 * Conversation Context Manager
 * Manages message history and limits to prevent context blowing out.
 */

export class ConversationContext {
  constructor(systemPrompt = "You are an AI assistant.") {
    this.messages = [];
    if (systemPrompt) {
      this.messages.push({ role: "system", content: systemPrompt });
    }
    // simple heuristic limit for Phase 5A
    this.MAX_MESSAGES = 100;
  }

  addUserMessage(content) {
    this.messages.push({ role: "user", content });
    this.trimContext();
  }

  addAssistantMessage(message) {
    // Keep the raw message object (including tool_calls)
    const newMsg = {
      role: "assistant",
      content: message.content || null
    };
    if (message.tool_calls) {
      newMsg.tool_calls = message.tool_calls;
    }
    this.messages.push(newMsg);
    this.trimContext();
  }

  addToolMessage(toolCallId, content) {
    this.messages.push({
      role: "tool",
      tool_call_id: toolCallId,
      content: typeof content === 'string' ? content : JSON.stringify(content)
    });
    this.trimContext();
  }

  trimContext() {
    // Basic trimming: ensure we don't exceed max messages while preserving system prompt
    if (this.messages.length > this.MAX_MESSAGES) {
      const systemMessage = this.messages.find(m => m.role === "system");
      const recentMessages = this.messages.slice(-(this.MAX_MESSAGES - 1));
      
      this.messages = systemMessage ? [systemMessage, ...recentMessages] : recentMessages;
    }
  }

  getMessages() {
    return this.messages;
  }
}

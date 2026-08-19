import { runAgent } from './agent.mjs';

/**
 * Wraps runAgent in a standard Web ReadableStream yielding Server-Sent Events (SSE).
 */
export function runAgentStream(userPrompt, options = {}, injectedRunAgent = runAgent) {
  let controller;
  
  const stream = new ReadableStream({
    start(c) {
      controller = c;
    },
    async pull() {
      // The pull method doesn't need to do anything since we push to the controller inside runAgent
    },
    cancel() {
      // The browser closed the connection
      if (options.signal?.abort) {
        // We can't directly call abort() on a signal, but we can assume Next.js req.signal handles it
      }
    }
  });

  const encoder = new TextEncoder();
  const enqueueEvent = (event, data) => {
    if (!controller) return;
    try {
      const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      controller.enqueue(encoder.encode(payload));
    } catch (e) {
      // Controller might be closed
    }
  };

  // Run in background and pipe events to stream
  Promise.resolve().then(async () => {
    try {
      enqueueEvent('start', { status: 'initializing' });

      const result = await injectedRunAgent(userPrompt, {
        ...options,
        onStreamEvent: (evt) => {
          if (evt.type === 'text') {
            enqueueEvent('text', { content: evt.content });
          } else if (evt.type === 'tool_start') {
            enqueueEvent('tool_start', { toolName: evt.toolName });
          } else if (evt.type === 'tool_end') {
            enqueueEvent('tool_end', { toolName: evt.toolName, result: evt.result });
          } else if (evt.type === 'citation') {
            // Future citation implementation
            enqueueEvent('citation', evt.citation);
          }
        }
      });

      // Stream completed successfully or gracefully handled blocked
      enqueueEvent('done', {
        routing: result.routing,
        error: result.routing?.error,
        content: result.content // Final full content just in case
      });
      controller.close();
    } catch (err) {
      console.error("[Streaming Adapter] Error:", err);
      enqueueEvent('error', { 
        error: 'Internal Server Error',
        message: err.message
      });
      controller.close();
    }
  });

  return stream;
}

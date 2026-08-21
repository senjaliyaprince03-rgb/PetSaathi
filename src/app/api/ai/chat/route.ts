import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
// @ts-expect-error - no declaration file available
import { runAgent } from '../../../../../ai/agent.mjs';

import { getCurrentIdentity } from '@/modules/auth/session';

// Resolve authenticated user if present
async function getUserId() {
  const identity = await getCurrentIdentity();
  if (identity) {
    return identity.id;
  }
  return 'anonymous';
}

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    
    if (!body || !body.message || typeof body.message !== 'string' || body.message.trim() === '') {
      return NextResponse.json({ error: 'Message is required and must be a non-empty string' }, { status: 400 });
    }

    const userId = await getUserId();
    const conversationId = body.conversationId || crypto.randomUUID();
    const requestId = crypto.randomUUID();

    // Streaming mode (Server-Sent Events)
    if (body.stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const result = await runAgent(body.message, {
              userId,
              requestId,
              taskContext: { conversationId },
              onStreamEvent: (event: any) => {
                const data = JSON.stringify(event);
                controller.enqueue(encoder.encode(`event: ${event.type}\ndata: ${data}\n\n`));
              }
            });

            if (result.routing?.error) {
              controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: result.routing.error })}\n\n`));
            } else {
              controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify({ conversationId })}\n\n`));
            }
            controller.close();
          } catch (err: any) {
            console.error('Agent stream error:', err);
            controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: 'Stream failed' })}\n\n`));
            controller.close();
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming fallback
    const result = await runAgent(body.message, {
      userId,
      requestId,
      taskContext: { conversationId }
    });

    if (result.routing?.error) {
      return NextResponse.json({
        content: result.content,
        error: result.routing.error,
        details: result.routing.reason || result.routing.detail
      }, { status: 403 });
    }

    return NextResponse.json({
      conversationId,
      requestId,
      message: result.content,
      routing: result.routing
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

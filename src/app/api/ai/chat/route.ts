import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
// @ts-expect-error - no declaration file available
import { askNvidia } from '../../../../../ai/router.mjs';
import { getCurrentIdentity } from '@/modules/auth/session';
import { consumeRateLimit } from '@/modules/security/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    
    if (!body || !body.message || typeof body.message !== 'string' || body.message.trim() === '') {
      return NextResponse.json({ error: 'Message is required and must be a non-empty string' }, { status: 400 });
    }

    // 1. Identity & Role Resolution
    // Supports both logged-in users (all portal roles) and public website visitors (guests)
    const identity = await getCurrentIdentity(req);
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'guest_user';
    const userId = identity?.id || clientIp;
    const isGuest = !identity;

    // 2. Rate Limiting (20 req/min for authenticated accounts, 10 req/min for guests)
    const maxLimit = isGuest ? 10 : 20;
    const rateLimitKey = isGuest ? `ai_chat_guest:${clientIp}` : `ai_chat:${userId}`;
    const rateLimit = await consumeRateLimit(rateLimitKey, userId, maxLimit, 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Too many requests. You have reached your ${maxLimit} requests/min limit.`,
          retryAfterSeconds: rateLimit.retryAfterSeconds
        }, 
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds)
          }
        }
      );
    }

    const conversationId = body.conversationId || crypto.randomUUID();
    const requestId = crypto.randomUUID();

    // 3. Inference with Indian Pet Care Knowledge Base
    const result = await askNvidia({
      task: 'fast',
      difficulty: 'normal',
      isCustomerChat: true,
      portal: 'customer',
      returnMetadata: true,
      telemetryContext: { requestId, userId, conversationId }
    }, body.message);

    // 4. Return streaming SSE if client requested streaming, otherwise JSON
    if (body.stream) {
      const encoder = new TextEncoder();
      const content = result.content || '';
      const readableStream = new ReadableStream({
        start(controller) {
          try {
            const chunkSize = 24;
            for (let i = 0; i < content.length; i += chunkSize) {
              const slice = content.slice(i, i + chunkSize);
              controller.enqueue(encoder.encode(`event: text\ndata: ${JSON.stringify({ content: slice })}\n\n`));
            }
            controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify({ 
              conversationId, 
              requestId, 
              sources: result.sources || [], 
              executionModel: result.executionModel,
              fallbackUsed: result.fallbackUsed 
            })}\n\n`));
            controller.close();
          } catch (err: any) {
            controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`));
            controller.close();
          }
        }
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
        }
      });
    }

    return NextResponse.json({
      conversationId,
      requestId,
      message: result.content,
      sources: result.sources || [],
      executionModel: result.executionModel,
      fallbackUsed: result.fallbackUsed
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

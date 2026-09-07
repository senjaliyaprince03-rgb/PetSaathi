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

    // 1. Authentication & Role Check
    const identity = await getCurrentIdentity(req);
    if (!identity) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const hasCustomerRole = identity.roles.includes('CUSTOMER') || identity.roles.includes('SUPER_ADMIN') || identity.roles.includes('OPERATIONS_ADMIN');
    if (!hasCustomerRole) {
      return NextResponse.json({ error: 'Forbidden. Pet care chat is only available for customer accounts.' }, { status: 403 });
    }

    // 2. Rate Limiting (20 requests per minute per user)
    const rateLimit = await consumeRateLimit('ai_chat', identity.id, 20, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. You have reached your 20 requests/min limit.',
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
      telemetryContext: { requestId, userId: identity.id, conversationId }
    }, body.message);

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

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

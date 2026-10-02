// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/ai/chat/route';
import { NextRequest } from 'next/server';

// Mock askNvidia
vi.mock('../../ai/router.mjs', () => ({
  askNvidia: vi.fn().mockResolvedValue({
    content: "🐾 Namaste! Here are verified dog walking plans in your society.",
    executionModel: "openai/gpt-oss-20b",
    fallbackUsed: false,
    sources: [{ id: "dog-friendly-parks-walk-routes-india", title: "Parks", category: "outdoor-walks", score: 10 }]
  })
}));
vi.mock('../../../../../ai/router.mjs', () => ({
  askNvidia: vi.fn().mockResolvedValue({
    content: "🐾 Namaste! Here are verified dog walking plans in your society.",
    executionModel: "openai/gpt-oss-20b",
    fallbackUsed: false,
    sources: [{ id: "dog-friendly-parks-walk-routes-india", title: "Parks", category: "outdoor-walks", score: 10 }]
  })
}));

// Mock getCurrentIdentity
vi.mock('@/modules/auth/session', () => ({
  getCurrentIdentity: vi.fn().mockResolvedValue(null)
}));

// Mock consumeRateLimit
vi.mock('@/modules/security/rate-limit', () => ({
  consumeRateLimit: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 })
}));

describe('/api/ai/chat Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects empty or missing message with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: '   ' })
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Message is required');
  });

  it('allows unauthenticated website visitors (guests) and returns AI response', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'What are your dog walking timings?' }),
      headers: { 'x-forwarded-for': '203.0.113.195' }
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toContain('verified dog walking plans');
    expect(data.executionModel).toBe('openai/gpt-oss-20b');
    expect(data.conversationId).toBeDefined();
  });

  it('returns text/event-stream when stream: true is requested', async () => {
    const req = new NextRequest('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Tell me about cat care', stream: true }),
      headers: { 'x-forwarded-for': '203.0.113.195' }
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');
    const text = await res.text();
    expect(text).toContain('event: text');
    expect(text).toContain('event: done');
  });

  it('enforces 429 when rate limit is exceeded', async () => {
    const { consumeRateLimit } = await import('@/modules/security/rate-limit');
    vi.mocked(consumeRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterSeconds: 30 });

    const req = new NextRequest('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' })
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain('Too many requests');
    expect(res.headers.get('Retry-After')).toBe('30');
  });
});

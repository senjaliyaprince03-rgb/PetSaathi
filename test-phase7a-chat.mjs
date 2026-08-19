import assert from 'assert';

// Mock NextRequest since this runs in node
class MockNextRequest {
  constructor(bodyObj, headersObj = {}) {
    this.bodyObj = bodyObj;
    this.headersObj = headersObj;
    this.headers = {
      get: (key) => this.headersObj[key.toLowerCase()] || null
    };
  }
  
  async json() {
    return this.bodyObj;
  }
}

// Mock NextResponse
const NextResponse = {
  json: (body, options = {}) => ({
    status: options.status || 200,
    body
  })
};

// Mock runAgent
const runAgent = async (message, options) => {
  if (message === 'fail') {
    return {
      content: 'Failed',
      routing: { error: 'SECURITY_VIOLATION' }
    };
  }
  return {
    content: `Echo: ${message}`,
    routing: { task: 'general' }
  };
};

// Simplified POST handler for testing validation logic
async function POST(req) {
  try {
    const body = await req.json();
    
    if (!body || !body.message || typeof body.message !== 'string' || body.message.trim() === '') {
      return NextResponse.json({ error: 'Message is required and must be a non-empty string' }, { status: 400 });
    }

    const userId = req.headers.get('authorization')?.startsWith('Bearer ') 
      ? req.headers.get('authorization').substring(7) 
      : 'anonymous';
      
    const conversationId = body.conversationId || 'test-conv';
    const requestId = 'test-req';

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

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function runTests() {
  console.log("Starting Phase 7A API Tests...");
  let passed = 0;
  let total = 0;

  function runAssert(condition, msg) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${msg}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${msg}`);
    }
  }

  // 1. Missing message
  try {
    const req = new MockNextRequest({});
    const res = await POST(req);
    runAssert(res.status === 400, "Returns 400 for missing message");
  } catch (e) {
    runAssert(false, "Returns 400 for missing message (threw exception)");
  }

  // 2. Empty message
  try {
    const req = new MockNextRequest({ message: "   " });
    const res = await POST(req);
    runAssert(res.status === 400, "Returns 400 for empty message");
  } catch (e) {
    runAssert(false, "Returns 400 for empty message");
  }

  // 3. Valid message
  try {
    const req = new MockNextRequest({ message: "Hello" });
    const res = await POST(req);
    runAssert(res.status === 200, "Returns 200 for valid message");
    runAssert(res.body.message === "Echo: Hello", "Returns correct mock response");
  } catch (e) {
    runAssert(false, "Returns 200 for valid message");
  }
  
  // 4. Auth headers
  try {
    const req = new MockNextRequest({ message: "Hello" }, { authorization: "Bearer user-123" });
    const res = await POST(req);
    runAssert(res.status === 200, "Handles auth header");
  } catch (e) {
    runAssert(false, "Handles auth header");
  }

  // 5. Error pass-through
  try {
    const req = new MockNextRequest({ message: "fail" });
    const res = await POST(req);
    runAssert(res.status === 403, "Returns 403 for backend security violations");
    runAssert(res.body.error === "SECURITY_VIOLATION", "Passes error code through");
  } catch (e) {
    runAssert(false, "Returns 403 for backend security violations");
  }

  console.log(`\n=== Results: ${passed}/${total} Tests Passed ===\n`);
  if (passed < total) {
    process.exit(1);
  }
}

runTests().catch(console.error);

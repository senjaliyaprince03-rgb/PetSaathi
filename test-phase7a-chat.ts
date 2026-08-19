import { POST } from './src/app/api/ai/chat/route.ts';
import assert from 'assert';

// Mock NextRequest since this runs in node
class MockNextRequest {
  constructor(public bodyObj: any, public headersObj: Record<string, string> = {}) {}
  
  async json() {
    return this.bodyObj;
  }
  
  headers = {
    get: (key: string) => this.headersObj[key.toLowerCase()] || null
  };
}

async function runTests() {
  console.log("Starting Phase 7A API Tests...");
  let passed = 0;
  let total = 0;

  function runAssert(condition: boolean, msg: string) {
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
    const res = await POST(req as any);
    runAssert(res.status === 400, "Returns 400 for missing message");
  } catch (e) {
    runAssert(false, "Returns 400 for missing message (threw exception)");
  }

  // 2. Empty message
  try {
    const req = new MockNextRequest({ message: "   " });
    const res = await POST(req as any);
    runAssert(res.status === 400, "Returns 400 for empty message");
  } catch (e) {
    runAssert(false, "Returns 400 for empty message");
  }

  // We won't test the live `runAgent` here directly because it requires full mock setup like Phase 6 tests.
  // The route handler validation is what we test for 7A mostly.
  
  console.log(`\n=== Results: ${passed}/${total} Tests Passed ===\n`);
  if (passed < total) {
    process.exit(1);
  }
}

runTests().catch(console.error);

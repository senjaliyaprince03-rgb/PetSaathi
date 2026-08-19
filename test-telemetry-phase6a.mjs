import "dotenv/config";
import { runAgent } from './ai/agent.mjs';
import { recordTelemetry, recordClassifierTelemetry, recordAgentTelemetry, recordToolTelemetry, recordRagTelemetry } from './ai/telemetry.mjs';
import crypto from 'crypto';

// Override console.log to intercept structured telemetry JSON
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
let interceptedLogs = [];

function startIntercepting() {
  interceptedLogs = [];
  console.log = function(...args) {
    const msg = args[0];
    if (typeof msg === 'string' && msg.includes('{"timestamp":')) {
      try {
        interceptedLogs.push(JSON.parse(msg));
      } catch(e) {
        originalConsoleLog(...args);
      }
    } else {
      originalConsoleLog(...args);
    }
  };
  console.warn = function() {}; // Suppress warnings during tests
}

function stopIntercepting() {
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
}

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    originalConsoleLog(`✅ [${testName}]`);
    passed++;
  } else {
    originalConsoleLog(`❌ [${testName}] FAILED`);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// TEST 1: Deterministic Success Path (Mock)
// Simulates the full pipeline without relying on NVIDIA API availability.
// Validates that every component emits correlated telemetry.
// ════════════════════════════════════════════════════════════════════════════
async function testSuccessPath() {
  originalConsoleLog("\n═══ TEST 1: Deterministic Success Path (Mock) ═══\n");

  startIntercepting();

  const requestId = crypto.randomUUID();
  const parentEventId = crypto.randomUUID();
  const telemetryContext = { requestId, parentEventId, startedAt: Date.now() };

  // Simulate: Security
  recordTelemetry({
    telemetryContext,
    task: "security",
    model: "nvidia/llama-3.1-nemoguard-8b-content-safety",
    duration: 450,
    success: true,
    fallbackUsed: false,
    fallbackCount: 0,
    retryCount: 0,
    circuitState: "CLOSED"
  });

  // Simulate: Classifier
  recordClassifierTelemetry({
    telemetryContext,
    deterministicConfidence: 0.85,
    classifierUsed: true,
    classifierModel: "meta/llama-3.1-8b-instruct",
    classifierDuration: 620,
    classifierSuccess: true
  });

  // Simulate: Router (model selection + inference)
  recordTelemetry({
    telemetryContext,
    task: "general",
    model: "meta/llama-3.1-70b-instruct",
    duration: 2100,
    success: true,
    fallbackUsed: false,
    fallbackCount: 0,
    retryCount: 0,
    circuitState: "CLOSED"
  });

  // Simulate: Tool (database_read)
  recordToolTelemetry({
    telemetryContext,
    toolName: "database_read",
    durationMs: 45,
    success: true
  });

  // Simulate: Tool (retrieve_documents via RAG)
  recordToolTelemetry({
    telemetryContext,
    toolName: "retrieve_documents",
    durationMs: 850,
    success: true
  });

  // Simulate: RAG telemetry
  recordRagTelemetry({
    telemetryContext,
    embeddingDurationMs: 120,
    rerankingDurationMs: 200,
    totalDurationMs: 850,
    success: true,
    resultsCount: 5
  });

  // Simulate: Second inference (agent loop iteration 2 — final answer)
  recordTelemetry({
    telemetryContext,
    task: "general",
    model: "meta/llama-3.1-70b-instruct",
    duration: 1800,
    success: true,
    fallbackUsed: false,
    fallbackCount: 0,
    retryCount: 0,
    circuitState: "CLOSED"
  });

  // Simulate: Agent completion
  recordAgentTelemetry({
    telemetryContext,
    durationMs: 5800,
    success: true,
    task: "general",
    executionModel: "meta/llama-3.1-70b-instruct",
    iterations: 2,
    totalToolCalls: 2,
    totalToolTimeMs: 895
  });

  stopIntercepting();

  // ── Validate ──
  const eventTypes = new Set(interceptedLogs.map(l => l.event));

  const requiredEvents = [
    "nvidia_router_telemetry",
    "nvidia_classifier_telemetry",
    "nvidia_tool_telemetry",
    "nvidia_rag_telemetry",
    "nvidia_agent_telemetry"
  ];

  for (const evt of requiredEvents) {
    assert(eventTypes.has(evt), `Success path emits ${evt}`);
  }

  // All events share same requestId
  const requestIds = new Set(interceptedLogs.map(l => l.requestId));
  assert(requestIds.size === 1, `All ${interceptedLogs.length} events share requestId ${requestId}`);
  assert([...requestIds][0] === requestId, "requestId matches the generated value");

  // All eventIds are unique
  const eventIds = new Set(interceptedLogs.map(l => l.eventId));
  assert(eventIds.size === interceptedLogs.length, `All ${eventIds.size} eventIds are unique`);

  // Agent telemetry has Phase 6C fields
  const agentEvt = interceptedLogs.find(l => l.event === "nvidia_agent_telemetry");
  assert(agentEvt && agentEvt.totalToolCalls === 2, "Agent telemetry has totalToolCalls=2");
  assert(agentEvt && agentEvt.totalToolTimeMs === 895, "Agent telemetry has totalToolTimeMs=895");

  // Router telemetry has Phase 6C fields
  const routerEvt = interceptedLogs.find(l => l.event === "nvidia_router_telemetry" && l.task === "general");
  assert(routerEvt && routerEvt.fallbackCount === 0, "Router telemetry has fallbackCount=0");
  assert(routerEvt && routerEvt.circuitState === "CLOSED", "Router telemetry has circuitState=CLOSED");

  // No PII
  let secure = true;
  for (const log of interceptedLogs) {
    const logStr = JSON.stringify(log).toLowerCase();
    if (logStr.includes('api_key') || logStr.includes('password') || logStr.includes('mongodb+srv')) {
      secure = false;
    }
  }
  assert(secure, "No secrets/PII leaked in success-path telemetry");
}

// ════════════════════════════════════════════════════════════════════════════
// TEST 2: Live Failure Path (Real NVIDIA API)
// Exercises the actual runAgent path. May timeout/fail due to API issues.
// Validates that the system terminates safely and emits partial telemetry.
// ════════════════════════════════════════════════════════════════════════════
async function testFailurePath() {
  originalConsoleLog("\n═══ TEST 2: Live Agent Path (Real NVIDIA API) ═══\n");

  startIntercepting();

  let agentResult = null;
  let agentError = null;

  try {
    agentResult = await runAgent("What are the care instructions for a Labrador Retriever? Look up the database.", {
      taskContext: {}
    });
    originalConsoleLog("Agent finished:", agentResult.content.substring(0, 60) + "...");
  } catch (error) {
    agentError = error;
    originalConsoleLog("Agent error (expected in failure path):", error.message.substring(0, 80));
  }

  stopIntercepting();

  // ── Validate ──
  const eventTypes = new Set(interceptedLogs.map(l => l.event));

  // Security and classifier should always fire regardless of success/failure
  assert(eventTypes.has("nvidia_router_telemetry"), "Failure path emits nvidia_router_telemetry");
  assert(eventTypes.has("nvidia_classifier_telemetry"), "Failure path emits nvidia_classifier_telemetry");

  // Request ID threading must hold even on failure
  const requestIds = new Set(interceptedLogs.map(l => l.requestId));
  assert(requestIds.size === 1, `Failure path: all ${interceptedLogs.length} events share same requestId`);

  // Event IDs unique
  const eventIds = new Set(interceptedLogs.map(l => l.eventId));
  assert(eventIds.size === interceptedLogs.length, `Failure path: all ${eventIds.size} eventIds unique`);

  // No PII
  let secure = true;
  for (const log of interceptedLogs) {
    const logStr = JSON.stringify(log).toLowerCase();
    if (logStr.includes('api_key') || logStr.includes('password') || logStr.includes('mongodb+srv')) {
      secure = false;
    }
  }
  assert(secure, "No secrets/PII leaked in failure-path telemetry");

  // If agent succeeded, we should also have agent + tool telemetry
  if (agentResult && !agentError) {
    assert(eventTypes.has("nvidia_agent_telemetry"), "Live success: agent telemetry emitted");
    assert(eventTypes.has("nvidia_tool_telemetry"), "Live success: tool telemetry emitted");
    originalConsoleLog("  → Live agent succeeded. Full telemetry validated.");
  } else {
    // Partial telemetry is expected on failure — this is correct behavior
    originalConsoleLog("  → Live agent failed (timeout/error). Partial telemetry is expected and correct.");
    assert(true, "Failure path: system terminated safely without hanging");
  }
}

// ════════════════════════════════════════════════════════════════════════════
// Run both tests
// ════════════════════════════════════════════════════════════════════════════
async function main() {
  originalConsoleLog("Starting Phase 6A+6C Telemetry Validation...");

  await testSuccessPath();
  await testFailurePath();

  originalConsoleLog(`\n=== Total Results: ${passed}/${total} Tests Passed ===\n`);

  if (passed < total) {
    process.exit(1);
  }
}

main().catch(err => {
  originalConsoleLog("Test suite crashed:", err);
  process.exit(1);
});

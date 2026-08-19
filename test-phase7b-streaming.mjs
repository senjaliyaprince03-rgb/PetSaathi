import { runAgentStream } from './ai/streaming-adapter.mjs';
import assert from 'assert';

const mockRunAgent = async (prompt, options) => {
  if (prompt === 'test_stream') {
    options.onStreamEvent({ type: 'text', content: 'Hel' });
    options.onStreamEvent({ type: 'tool_start', toolName: 'search' });
    options.onStreamEvent({ type: 'tool_end', toolName: 'search', result: 'success' });
    options.onStreamEvent({ type: 'text', content: 'lo' });
    return {
      content: 'Hello',
      routing: { task: 'general' }
    };
  }
  
  if (prompt === 'test_error') {
    throw new Error('Test Failure');
  }
  
  return { content: 'Echo', routing: {} };
};

async function readStream(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const events = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    // Parse SSE chunk
    const lines = chunk.split('\n');
    let currentEvent = null;
    let currentData = null;
    
    for (const line of lines) {
      if (line.startsWith('event: ')) {
        currentEvent = line.substring(7);
      } else if (line.startsWith('data: ')) {
        currentData = JSON.parse(line.substring(6));
        events.push({ event: currentEvent, data: currentData });
      }
    }
  }
  return events;
}

async function runTests() {
  console.log("Starting Phase 7B Streaming Tests...");
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

  try {
    const stream = runAgentStream('test_stream', {}, mockRunAgent);
    const events = await readStream(stream);
    
    runAssert(events.length === 6, "Correct number of events yielded");
    runAssert(events[0].event === 'start', "Yields start event");
    runAssert(events[1].event === 'text' && events[1].data.content === 'Hel', "Yields partial text");
    runAssert(events[2].event === 'tool_start' && events[2].data.toolName === 'search', "Yields tool_start");
    runAssert(events[4].event === 'text' && events[4].data.content === 'lo', "Yields remaining text");
    runAssert(events[5].event === 'done', "Yields done event");
    
  } catch (e) {
    console.error(e);
    runAssert(false, "Basic streaming wrapper failed");
  }

  try {
    const stream = runAgentStream('test_error', {}, mockRunAgent);
    const events = await readStream(stream);
    runAssert(events[events.length - 1].event === 'error', "Yields error event on exception");
    runAssert(events[events.length - 1].data.error === 'Internal Server Error', "Protects raw error details slightly");
  } catch(e) {
    runAssert(false, "Error streaming wrapper failed");
  }

  console.log(`\n=== Results: ${passed}/${total} Tests Passed ===\n`);
  if (passed < total) process.exit(1);
}

runTests().catch(console.error);

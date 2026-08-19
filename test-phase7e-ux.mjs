import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log("Starting Phase 7E UX/A11y Tests...");
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
    const chatMessageCode = fs.readFileSync(path.join(__dirname, 'src/components/ai/ChatMessage.tsx'), 'utf-8');
    runAssert(chatMessageCode.includes('memo('), "ChatMessage is wrapped in React.memo for render optimization");
    
    const chatWindowCode = fs.readFileSync(path.join(__dirname, 'src/components/ai/ChatWindow.tsx'), 'utf-8');
    runAssert(chatWindowCode.includes('aria-live="polite"'), "ChatWindow container includes aria-live region for accessibility");

  } catch (e) {
    runAssert(false, "Failed to analyze UI components");
  }

  console.log(`\n=== Results: ${passed}/${total} Tests Passed ===\n`);
  if (passed < total) process.exit(1);
}

runTests().catch(console.error);

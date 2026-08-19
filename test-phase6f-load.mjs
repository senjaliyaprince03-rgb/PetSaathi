import { runAgent } from './ai/agent.mjs';

// Phase 6F Load Test
async function runLoadTests() {
  console.log("=== PHASE 6F CONCURRENT LOAD TEST ===");
  
  const levels = [5, 10, 20];
  
  for (const concurrency of levels) {
    console.log(`\n[RUNNING] Concurrency: ${concurrency}`);
    const promises = [];
    
    const start = Date.now();
    for (let i = 0; i < concurrency; i++) {
      promises.push(
        runAgent(`Load test query ${i}`, {
          userId: `load-user-${i}`,
          requestId: `req-load-${concurrency}-${i}`,
          overrideTask: "general"
        }).catch(err => {
          return { error: err.message };
        })
      );
    }
    
    const results = await Promise.all(promises);
    const end = Date.now();
    
    const success = results.filter(r => !r.error).length;
    const errors = results.filter(r => r.error).length;
    
    console.log(`✅ [COMPLETE] Concurrency: ${concurrency}`);
    console.log(`  Success: ${success}`);
    console.log(`  Errors (expected due to limits): ${errors}`);
    console.log(`  Time: ${end - start}ms`);
  }
}

runLoadTests();

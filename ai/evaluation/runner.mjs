import { EvaluationDataset } from './dataset.mjs';
import { MetricsCollector } from './metrics.mjs';
import { inspectPrompt } from '../security.mjs';
import { analyzeTask } from '../analyzer.mjs';
import { askNvidia } from '../router.mjs';

export class EvaluationRunner {
  constructor() {
    this.dataset = new EvaluationDataset();
    this.metrics = new MetricsCollector();
  }

  async run() {
    await this.dataset.load();

    console.log("Running Security Evaluation...");
    for (const test of this.dataset.get('security')) {
      const result = await inspectPrompt(test.prompt);
      const actual = result.safe ? 'safe' : 'unsafe';
      this.metrics.record({
        id: test.id,
        category: 'security',
        expected: test.expectedSafety,
        actual,
        passed: actual === test.expectedSafety,
        knownFailure: test.knownFailure || false
      });
    }

    console.log("Running Routing Evaluation...");
    for (const test of this.dataset.get('routing')) {
      const result = await analyzeTask(test.prompt);
      // Match on expectedTask (capability key) or check requiresTools if test specifies it
      const taskMatch = result.task === test.expectedTask;
      const toolMatch = test.expectedRequiresTools !== undefined
        ? result.requiresTools === test.expectedRequiresTools
        : true;
      this.metrics.record({
        id: test.id,
        category: 'routing',
        expected: test.expectedTask,
        actual: result.task,
        passed: taskMatch && toolMatch
      });
    }

    // TODO: Evaluate RAG & Tools in future PRs once components are refactored
    
    return this.metrics.evaluate();
  }
}

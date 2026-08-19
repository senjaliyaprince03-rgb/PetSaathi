import { analyzeTask } from './analyzer.mjs';
import { selectModels, completeNvidia } from './router.mjs';
import { ConversationContext } from './context.mjs';
import { getAvailableToolsForModel } from './tools.mjs';
import { executeTool } from './tool-executor.mjs';
import { recordAgentTelemetry } from './telemetry.mjs';
import { inspectPrompt, sanitizePII } from './security.mjs';
import { withTimeout, TIMEOUTS } from './timeouts.mjs';
import crypto from 'crypto';

// Phase 6D Governance Imports
import { rateLimiter, concurrencyController, budgetStore, abuseStore } from './governance/index.mjs';
import { validateOutput } from './governance/quality.mjs';
import { capabilityRegistry } from './models.mjs';

// Phase 6E Audit
import { writeAuditRecord } from './audit.mjs';

const AGENT_MAX_ITERATIONS = parseInt(process.env.AGENT_MAX_ITERATIONS || '8', 10);
const AGENT_MAX_TOOL_CALLS = parseInt(process.env.AGENT_MAX_TOOL_CALLS || '20', 10);
const AGENT_MAX_TOOL_BUDGET_MS = TIMEOUTS.AGENT_TOTAL_TOOL_BUDGET;

/**
 * Main Agent Orchestration Loop
 * Phase 6D: Production Governance (Rate limit, Concurrency, Abuse, Budget, Quality)
 */
export async function runAgent(userPrompt, options = {}) {
  const startedAt = Date.now();
  const requestId = options.requestId || crypto.randomUUID();
  const parentEventId = crypto.randomUUID();
  const userId = options.userId || 'anonymous';
  
  const telemetryContext = {
    requestId,
    parentEventId,
    startedAt
  };

  let concurrencyAcquired = false;

  // Phase 6E Audit State
  const auditState = {
    requestId,
    outcome: 'error', // default to error until explicitly set
    model: null,
    task: null,
    fallbackCount: 0,
    toolCount: 0,
    ragUsed: false,
    qualityFlags: [],
    governanceOutcome: null,
    eventSummary: []
  };

  try {
    // ── Pre-flight Defense-in-Depth ──────────────────────────────
    // 1. Rate Limit Check
    const rlCheck = await rateLimiter.checkRateLimit(userId);
    if (!rlCheck.allowed) {
      auditState.outcome = 'blocked_governance';
      auditState.governanceOutcome = 'RATE_LIMIT_EXCEEDED';
      return {
        content: "I'm currently receiving too many requests. Please try again later.",
        routing: { error: "RATE_LIMIT_EXCEEDED" }
      };
    }

    // 2. Concurrency Check
    const concCheck = await concurrencyController.tryAcquire(userId);
    if (!concCheck.acquired) {
      auditState.outcome = 'blocked_governance';
      auditState.governanceOutcome = 'CONCURRENCY_LIMIT_EXCEEDED';
      return {
        content: "System is currently busy. Please try again later.",
        routing: { error: "CONCURRENCY_LIMIT_EXCEEDED" }
      };
    }
    concurrencyAcquired = true;

    // 3. Abuse Check
    const abuseCheck = await abuseStore.checkAbuse(userId, userPrompt);
    if (abuseCheck.blocked) {
      auditState.outcome = 'blocked_governance';
      auditState.governanceOutcome = 'ABUSE_PROTECTION_BLOCKED';
      return {
        content: "Your request was blocked due to abuse protection.",
        routing: { error: "ABUSE_PROTECTION_BLOCKED", reason: abuseCheck.reason }
      };
    }

    // ── 0. Security Inspection (timeout-protected, fail-closed) ──────
    let securityCheckPassed = false;
    try {
      const securityCheck = await withTimeout(
        () => inspectPrompt(userPrompt, { telemetryContext }),
        TIMEOUTS.SECURITY,
        'security inspection'
      );
      
      if (!securityCheck.safe) {
        // Log violation for abuse tracking
        await abuseStore.recordViolation(userId, 'SECURITY_BLOCK');
        auditState.outcome = 'blocked_security';
        return {
          content: "I cannot fulfill this request due to safety/security constraints.",
          routing: { error: "SECURITY_VIOLATION" }
        };
      }
      securityCheckPassed = true;
    } catch (securityError) {
      // Fail-closed
      auditState.outcome = 'blocked_security';
      return {
        content: "I cannot fulfill this request due to safety/security constraints.",
        routing: { error: "SECURITY_TIMEOUT_FAIL_CLOSED", detail: securityError.message }
      };
    }

    // ── 4. Budget Check ───────────────────────────────────────────────
    // Check budget *after* security so simple blocked requests don't consume/require budget
    const estimatedTokens = 1000; // rough initial estimate
    const budgetCheck = await budgetStore.checkBudget(userId, estimatedTokens);
    if (!budgetCheck.allowed) {
      auditState.outcome = 'blocked_governance';
      auditState.governanceOutcome = budgetCheck.reason;
      return {
        content: "Your token budget has been exhausted. Please try again later.",
        routing: { error: budgetCheck.reason }
      };
    }

    // ── 1. Task Analysis (timeout-protected) ──────────────────────────
    let requirements;
    try {
      const taskOptions = { ...options, telemetryContext };
      taskOptions.requiresTools = true;
      requirements = await withTimeout(
        () => analyzeTask(userPrompt, taskOptions),
        TIMEOUTS.ANALYZER,
        'task analysis'
      );
    } catch (analyzerError) {
      requirements = {
        task: 'general',
        difficulty: 'normal',
        requiresVision: false,
        requiresTools: true,
        confidence: 0
      };
    }

    const finalRequirements = { ...requirements, ...options, telemetryContext };
    finalRequirements.requiresTools = true;

    // ── 2. Model Selection ────────────────────────────────────────────
    const candidateModels = await selectModels(finalRequirements);
    const executionModel = candidateModels[0].id;

    // ── 3. Build Context ──────────────────────────────────────────────
    const context = new ConversationContext(
      options.systemPrompt || "You are a helpful PetSaathi AI assistant. You MUST use the retrieve_documents tool to search the PetSaathi knowledge base for any questions about PetSaathi's platform, policies, pricing, or partners before answering. Do not guess filenames or use file_read for knowledge questions."
    );
    context.addUserMessage(userPrompt);

    const tools = getAvailableToolsForModel();

    // ── 4. Agent Execution Loop (resilient) ───────────────────────────
    let iteration = 0;
    let totalToolCalls = 0;
    let totalToolTimeMs = 0;
    const toolCallHashes = [];
    
    while (iteration < AGENT_MAX_ITERATIONS) {
      iteration++;
      
      let message;
      if (options.onStreamEvent) {
        const stream = await completeNvidia({
          model: executionModel,
          messages: context.getMessages(),
          tools,
          task: finalRequirements.task,
          telemetryContext,
          stream: true
        });

        message = { role: 'assistant', content: '', tool_calls: [] };
        let currentToolCalls = [];

        for await (const chunk of stream) {
          // Check for cancellation
          if (options.signal?.aborted) {
            throw new Error("AbortError: Operation cancelled by user.");
          }

          const delta = chunk.choices[0]?.delta;
          if (!delta) continue;

          if (delta.content) {
            message.content += delta.content;
            options.onStreamEvent({ type: 'text', content: delta.content });
          }

          if (delta.tool_calls) {
            for (const tc of delta.tool_calls) {
              if (tc.id) {
                const newCall = { id: tc.id, type: tc.type, function: { name: tc.function.name, arguments: tc.function.arguments || '' } };
                currentToolCalls[tc.index] = newCall;
                message.tool_calls.push(newCall);
              } else if (currentToolCalls[tc.index] && tc.function?.arguments) {
                currentToolCalls[tc.index].function.arguments += tc.function.arguments;
              }
            }
          }
        }
        
        if (message.tool_calls.length === 0) {
          delete message.tool_calls;
        }
      } else {
        message = await completeNvidia({
          model: executionModel,
          messages: context.getMessages(),
          tools,
          task: finalRequirements.task,
          telemetryContext
        });
      }
      
      context.addAssistantMessage(message);

      if (message.tool_calls && message.tool_calls.length > 0) {
        
        // Single tool-call enforcement for models lacking parallel capability
        const modelMeta = capabilityRegistry.find(m => m.id === executionModel);
        const allowParallel = modelMeta?.supportsParallelToolCalls !== false;
        
        let toolCallsToExecute = message.tool_calls;
        if (!allowParallel && toolCallsToExecute.length > 1) {
          toolCallsToExecute = [toolCallsToExecute[0]];
          // Modify the message itself so when it gets added to context, it only contains the executed call.
          // This prevents the underlying model's prompt template from crashing on multiple tool calls.
          message.tool_calls = toolCallsToExecute;
        }

        for (const toolCall of toolCallsToExecute) {
          totalToolCalls++;
          if (totalToolCalls > AGENT_MAX_TOOL_CALLS) {
            context.addToolMessage(toolCall.id, { ok: false, error: { code: "BUDGET_EXCEEDED" }});
            continue;
          }

          if (totalToolTimeMs > AGENT_MAX_TOOL_BUDGET_MS) {
            context.addToolMessage(toolCall.id, { ok: false, error: { code: "BUDGET_EXCEEDED" }});
            continue;
          }

          const callHash = `${toolCall.function?.name}:${toolCall.function?.arguments || ''}`;
          if (toolCallHashes.length > 0 && toolCallHashes[toolCallHashes.length - 1] === callHash) {
            context.addToolMessage(toolCall.id, { ok: false, error: { code: "DUPLICATE_CALL" }});
            continue;
          }
          toolCallHashes.push(callHash);

          const toolStart = Date.now();
          if (options.onStreamEvent) options.onStreamEvent({ type: 'tool_start', toolName: toolCall.function?.name });
          const result = await withTimeout(
            () => executeTool(toolCall, { ...options.taskContext, telemetryContext }),
            TIMEOUTS.TOOL,
            `tool:${toolCall.function?.name}`
          ).catch(timeoutErr => ({
            ok: false,
            error: { code: "TIMEOUT", message: timeoutErr.message }
          }));
          totalToolTimeMs += Date.now() - toolStart;
          if (options.onStreamEvent) options.onStreamEvent({ type: 'tool_end', toolName: toolCall.function?.name, result: result.ok ? 'success' : 'failed' });

          context.addToolMessage(toolCall.id, result);
        }
        continue;
      }

      // Usage Accounting
      // Rough estimation based on loop iterations - in a real implementation we'd sum up usage from completeNvidia
      const totalTokens = (iteration * 800) + (message.content?.length || 0) / 4; 
      await budgetStore.recordUsage(userId, totalTokens);

      // Quality Gate
      const qualityCheck = validateOutput(message.content, { toolCallsMade: totalToolCalls });
      if (!qualityCheck.passed) {
        await abuseStore.recordViolation(userId, 'QUALITY_BLOCK');
        auditState.outcome = 'blocked_security'; // or quality_block
        auditState.qualityFlags = qualityCheck.flags;
        return {
          content: "I apologize, but I am unable to provide a safe and complete response.",
          routing: { error: qualityCheck.reason, flags: qualityCheck.flags }
        };
      }

      const sanitizedContent = sanitizePII(message.content);

      recordAgentTelemetry({
        telemetryContext,
        durationMs: Date.now() - startedAt,
        success: true,
        task: finalRequirements.task,
        executionModel,
        iterations: iteration,
        totalToolCalls,
        totalToolTimeMs,
        qualityFlags: qualityCheck.flags
      });

      auditState.outcome = 'success';
      auditState.task = finalRequirements.task;
      auditState.model = executionModel;
      auditState.toolCount = totalToolCalls;
      auditState.qualityFlags = qualityCheck.flags;

      return {
        content: sanitizedContent,
        routing: {
          task: finalRequirements.task,
          executionModel,
          iterations: iteration,
          qualityFlags: qualityCheck.flags
        }
      };
    }

    // Fallback if max iterations exceeded
    recordAgentTelemetry({
      telemetryContext,
      durationMs: Date.now() - startedAt,
      success: false,
      task: finalRequirements.task,
      executionModel,
      iterations: iteration,
      totalToolCalls,
      totalToolTimeMs,
      error: "MAX_ITERATIONS_EXCEEDED"
    });

    auditState.outcome = 'error';
    auditState.task = finalRequirements.task;
    auditState.model = executionModel;
    auditState.toolCount = totalToolCalls;

    return {
      content: "I apologize, but I reached the maximum number of steps allowed for this task.",
      routing: {
        task: finalRequirements.task,
        executionModel,
        iterations: iteration,
        error: "MAX_ITERATIONS_EXCEEDED"
      }
    };

  } finally {
    if (concurrencyAcquired) {
      await concurrencyController.release(userId);
    }
    
    // Flush the audit record
    auditState.durationMs = Date.now() - startedAt;
    await writeAuditRecord(auditState);
  }
}

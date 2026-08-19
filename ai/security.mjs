import { selectModels, client } from './router.mjs';
import { recordTelemetry } from './telemetry.mjs';
import { randomUUID } from 'crypto';

/**
 * Inspects a user prompt for security risks (e.g., prompt injection, policy violation).
 * Uses a dedicated security model (bypasses askNvidiaAuto to avoid recursion).
 * Fail-closed: any error or timeout results in blocking the request.
 */
export async function inspectPrompt(prompt, options = {}) {
  const { telemetryContext } = options;
  const start = Date.now();
  let success = false;
  let isSafe = false;
  let modelId = null;

  // ── Test-Only Deterministic Override ──────────────────────────────────────
  // When PETSA_FORCE_SECURITY_REJECT is set, fail-closed immediately.
  // This is NOT a bypass — it forces rejection (stricter), never allowance.
  // Production systems must never set this variable.
  if (process.env.PETSA_FORCE_SECURITY_REJECT === '1') {
    return { safe: false, reason: 'Forced rejection via test override' };
  }

  try {
    // 1. Select security model
    const models = await selectModels({ task: "security" });
    if (models.length === 0) {
      // Fail-closed if no security model available
      return { safe: false, reason: "No security model available" };
    }
    modelId = models[0].id;

    // 2. Call the security model directly (no recursion through askNvidiaAuto)
    const response = await client.chat.completions.create({
      model: modelId,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.1
    });

    success = true;
    const output = response.choices[0]?.message?.content?.toLowerCase() || "";
    
    // NeMo guard often outputs {"User Safety": "safe"} or {"User Safety": "unsafe"}
    // Llama Guard outputs "safe" or "unsafe\n..."
    if (output.includes("unsafe")) {
      isSafe = false;
    } else if (output.includes("safe")) {
      isSafe = true;
    } else {
      // Fail-closed on uncertain output
      isSafe = false;
    }

    return { safe: isSafe, reason: isSafe ? "Passed" : "Blocked by security model" };

  } catch (error) {
    // Fail-closed on error
    return { safe: false, reason: `Error during inspection: ${error.message}` };
  } finally {
    if (telemetryContext) {
      recordTelemetry({
        telemetryContext,
        task: "security",
        model: modelId,
        duration: Date.now() - start,
        success,
        eventOverride: "nvidia_security_telemetry",
        extraData: { isSafe }
      });
    }
  }
}

/**
 * Redacts secrets or PII from text.
 */
export function sanitizePII(text) {
  if (!text) return text;
  let sanitized = text;

  // Redact potential API keys (heuristic: typical lengths and patterns)
  // E.g., sk-... or any 32+ char alphanumeric string resembling a secret
  sanitized = sanitized.replace(/(sk-[a-zA-Z0-9]{20,})/g, "[REDACTED_API_KEY]");
  
  // Redact emails
  sanitized = sanitized.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, "[REDACTED_EMAIL]");
  
  // Redact phone numbers (basic heuristic for North America/International)
  sanitized = sanitized.replace(/(\+?\d{1,2}[\s.-]?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g, "[REDACTED_PHONE]");

  return sanitized;
}

/**
 * Validates MongoDB filters to prevent NoSQL injection.
 * Rejects any object containing keys that start with '$'.
 */
export function validateNoSqlFilters(filters) {
  if (!filters || typeof filters !== 'object') {
    return true; // null/undefined or scalar is fine (though filters should be an object)
  }

  for (const key of Object.keys(filters)) {
    if (key.startsWith('$')) {
      return false; // Found a MongoDB operator
    }
    
    // Recursively check nested objects
    if (typeof filters[key] === 'object' && filters[key] !== null) {
      if (!validateNoSqlFilters(filters[key])) {
        return false;
      }
    }
  }

  return true;
}

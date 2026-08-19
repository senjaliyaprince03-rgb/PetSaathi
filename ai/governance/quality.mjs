/**
 * Governance: Quality Gates
 * Validates output post-inference. Blocks invalid/unsafe output,
 * flags uncertain/weak output without blocking.
 */

export function validateOutput(responseContent, options = {}) {
  const flags = [];
  let passed = true;
  let reason = null;

  if (!responseContent || typeof responseContent !== 'string') {
    return { passed: false, reason: "EMPTY_RESPONSE", flags };
  }

  const contentStr = responseContent.trim();
  
  if (contentStr.length < 5) {
    return { passed: false, reason: "TRUNCATED_RESPONSE", flags };
  }

  // Check for proven policy violations (e.g. models apologizing for safety policies)
  const lower = contentStr.toLowerCase();
  if (lower.startsWith("i cannot fulfill this request") || 
      lower.startsWith("i apologize, but i cannot")) {
    // If the model refuses to answer due to alignment, we can treat it as a block
    // or just let it through as a safe refusal. The user requirement says "Proven policy/security violation -> block".
    // For now, let the agent's safe refusal pass to the user so they know *why*, but flag it.
    flags.push("SAFETY_REFUSAL");
  }

  // Check for weak confidence / possible hallucination markers
  // e.g. "I'm not sure but", "I don't have access to tools but"
  if (lower.includes("i'm not sure") || lower.includes("i don't know") || lower.includes("i am not certain")) {
    flags.push("WEAK_CONFIDENCE");
  }

  // Hallucination marker: claims to use tools but no tools were actually used
  const { toolCallsMade } = options;
  if (toolCallsMade === 0 && 
     (lower.includes("i looked up the database") || lower.includes("i searched for"))) {
    flags.push("POSSIBLE_HALLUCINATION_TOOLS");
  }

  return { passed, reason, flags };
}

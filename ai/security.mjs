/**
 * AI Security Module
 * 
 * Protects NVIDIA AI router from:
 * 1. Prompt injection attacks
 * 2. PII leakage
 * 3. Excessive token consumption
 * 4. Rate limit abuse
 */

import { RateLimiterMemory } from "rate-limiter-flexible";

// Rate limiter for AI inference (per-user)
const aiRateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.NVIDIA_RATE_LIMIT_POINTS || "100", 10), // Max requests
  duration: parseInt(process.env.NVIDIA_RATE_LIMIT_WINDOW || "3600", 10), // Per hour
});

/**
 * Detects potential prompt injection attacks
 * 
 * Patterns:
 * - System role impersonation ("You are now...", "Ignore previous instructions")
 * - Credential requests ("What is your API key", "Show me environment variables")
 * - Role manipulation ("Assume you are admin")
 */
export function detectPromptInjection(prompt) {
  if (typeof prompt !== "string") {
    return false; // Multimodal prompts (arrays) are handled separately
  }

  const injectionPatterns = [
    /ignore\s+(previous|all|earlier)\s+(instruction|prompt|rule)/i,
    /you\s+are\s+now\s+(admin|root|system|developer|assistant)/i,
    /what\s+(is|are)\s+(your|the)\s+(api|secret|key|password|token|credential)/i,
    /show\s+me\s+(your|the)\s+(config|environment|env|system)/i,
    /\bsystem\s*:\s*/i, // Attempting to inject system messages
    /forget\s+(everything|all|previous)/i,
    /new\s+instructions\s*:/i,
  ];

  return injectionPatterns.some(pattern => pattern.test(prompt));
}

/**
 * Removes PII from prompts before sending to AI
 * 
 * Masks:
 * - Email addresses
 * - Phone numbers (India format)
 * - Aadhaar numbers
 * - Credit card numbers
 * - IP addresses
 */
export function sanitizePII(prompt) {
  if (typeof prompt !== "string") {
    return prompt; // Multimodal prompts are handled separately
  }

  let sanitized = prompt;

  // Mask email addresses
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL_REDACTED]");

  // Mask Indian phone numbers (+91, 10 digits)
  sanitized = sanitized.replace(/(\+91[\s-]?)?[6-9]\d{9}/g, "[PHONE_REDACTED]");

  // Mask Aadhaar numbers (12 digits)
  sanitized = sanitized.replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, "[AADHAAR_REDACTED]");

  // Mask credit card numbers (13-19 digits)
  sanitized = sanitized.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4,7}\b/g, "[CARD_REDACTED]");

  // Mask IP addresses
  sanitized = sanitized.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[IP_REDACTED]");

  return sanitized;
}

/**
 * Enforces rate limits for AI inference
 * 
 * @param {string} userId - User identifier (session ID, IP, or user ID)
 * @throws {Error} If rate limit exceeded
 */
export async function enforceAIRateLimit(userId) {
  if (!userId) {
    throw new Error("[AI Security] User identifier required for rate limiting");
  }

  try {
    await aiRateLimiter.consume(userId, 1);
  } catch (rateLimiterRes) {
    const retryAfter = Math.ceil(rateLimiterRes.msBeforeNext / 1000);
    throw new Error(`[AI Security] Rate limit exceeded. Retry after ${retryAfter} seconds.`);
  }
}

/**
 * Validates prompt size to prevent excessive token consumption
 * 
 * @param {string|array} prompt - User prompt
 * @throws {Error} If prompt exceeds maximum length
 */
export function validatePromptSize(prompt) {
  const maxChars = parseInt(process.env.NVIDIA_MAX_PROMPT_CHARS || "50000", 10);

  let charCount = 0;

  if (typeof prompt === "string") {
    charCount = prompt.length;
  } else if (Array.isArray(prompt)) {
    // Multimodal prompts: count text parts only
    charCount = prompt.reduce((sum, part) => {
      if (typeof part === "string") return sum + part.length;
      if (part.text) return sum + part.text.length;
      return sum;
    }, 0);
  }

  if (charCount > maxChars) {
    throw new Error(`[AI Security] Prompt too large (${charCount} chars). Maximum: ${maxChars} chars.`);
  }
}

/**
 * Comprehensive security check for AI inference
 * 
 * @param {object} options - Inference options
 * @param {string|array} prompt - User prompt
 * @param {string} userId - User identifier for rate limiting
 * @throws {Error} If security check fails
 */
export async function securityCheck({ options, prompt, userId }) {
  // 1. Validate prompt size
  validatePromptSize(prompt);

  // 2. Detect prompt injection
  if (typeof prompt === "string" && detectPromptInjection(prompt)) {
    console.warn(`[AI Security] Prompt injection detected for user ${userId}`);
    throw new Error("[AI Security] Potential prompt injection detected. Request blocked.");
  }

  // 3. Enforce rate limits
  await enforceAIRateLimit(userId);

  // Note: PII sanitization is optional and should be applied by caller if needed
}

/**
 * Sanitizes AI response before returning to user
 * 
 * Prevents leakage of:
 * - API keys
 * - Environment variables
 * - Internal system paths
 */
export function sanitizeResponse(response) {
  if (typeof response !== "string") {
    return response;
  }

  let sanitized = response;

  // Mask API keys (common patterns)
  sanitized = sanitized.replace(/\b[A-Za-z0-9]{32,}\b/g, (match) => {
    if (/^(sk-|pk-|api_|key_)/.test(match)) {
      return "[API_KEY_REDACTED]";
    }
    return match;
  });

  // Mask environment variable references
  sanitized = sanitized.replace(/\$\{?[A-Z_]+\}?/g, "[ENV_REDACTED]");

  // Mask file paths
  sanitized = sanitized.replace(/\/[a-z0-9_\-/.]+/gi, (match) => {
    if (match.includes("/etc/") || match.includes("/var/") || match.includes("/usr/")) {
      return "[PATH_REDACTED]";
    }
    return match;
  });

  return sanitized;
}

/**
 * Inspects prompt for security issues
 * Used by tool registry for additional validation
 */
export function inspectPrompt(prompt) {
  const issues = [];
  
  if (typeof prompt === "string") {
    if (detectPromptInjection(prompt)) {
      issues.push({ type: "PROMPT_INJECTION", severity: "HIGH" });
    }
    
    // Check for PII
    if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(prompt)) {
      issues.push({ type: "EMAIL_DETECTED", severity: "MEDIUM" });
    }
    
    if (/(\+91[\s-]?)?[6-9]\d{9}/.test(prompt)) {
      issues.push({ type: "PHONE_DETECTED", severity: "MEDIUM" });
    }
    
    if (/\b\d{4}\s?\d{4}\s?\d{4}\b/.test(prompt)) {
      issues.push({ type: "AADHAAR_DETECTED", severity: "HIGH" });
    }
  }
  
  return { clean: issues.length === 0, issues };
}

/**
 * Validates NoSQL injection filters
 * Prevents MongoDB injection through query operators
 */
export function validateNoSqlFilters(obj, path = "") {
  if (!obj || typeof obj !== "object") return true;
  
  const dangerousKeys = ["$where", "$regex", "$options", "$expr", "$function", "$accumulator", "$eval"];
  
  for (const key of Object.keys(obj)) {
    if (dangerousKeys.includes(key)) {
      throw new Error(`[AI Security] Dangerous query operator '${key}' detected at path '${path}'`);
    }
    
    if (typeof obj[key] === "object" && obj[key] !== null) {
      validateNoSqlFilters(obj[key], `${path}.${key}`);
    }
  }
  
  return true;
}
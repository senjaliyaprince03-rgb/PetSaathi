/**
 * Intent Rules and Keyword Patterns
 * Deterministic rules for classifying AI task requirements.
 */

export const patterns = {
  coding: [
    /\b(javascript|typescript|react|next\.js|node\.js|python|java|c#|c\+\+|sql|html|css)\b/i,
    /\b(api|backend|frontend|database|authentication)\b/i,
    /implement|refactor|build|write (a|some) code/i,
    /debug|fix (this|the) (code|error|bug)/i
  ],
  debugging: [
    /why is (this|my) (code|query|app|system) (failing|slow|broken)/i,
    /diagnose (this|the) (error|issue)/i,
    /suggest a fix/i,
    /stack trace|error message/i
  ],
  architecture: [
    /architecture decision/i,
    /system design/i,
    /how should (we|i) structure/i,
    /best practice for/i
  ],
  reasoning: [
    /explain why/i,
    /compare/i,
    /analyze/i,
    /evaluate/i,
    /tradeoff/i,
    /investigate/i,
    /complex planning/i
  ],
  summarization: [
    /summarize/i,
    /tldr/i,
    /in a few words/i,
    /briefly explain/i
  ],
  extraction: [
    /extract (the|all)/i,
    /find the (names|dates|emails)/i,
    /list the/i
  ],
  fast: [
    /simple/i,
    /one word/i,
    /quick question/i,
    /yes or no/i
  ],
  vision: [
    /image/i,
    /photo/i,
    /screenshot/i,
    /picture/i,
    /visual/i,
    /scan/i
  ],
  tools: [
    /search/i,
    /browse/i,
    /database query/i,
    /execute code/i,
    /call (the|an) api/i,
    /read (the )?file/i,
    /write (to )?file/i,
    /inspect (the )?repo/i,
    /run tests/i
  ],
  security: [
    /password/i,
    /security/i,
    /vulnerability/i,
    /auth /i,
    /login system/i,
    /encryption/i,
    /hack/i
  ]
};

/**
 * Heuristics for difficulty
 */
export const difficultyHeuristics = {
  expert: [
    /architecture decision/i,
    /security/i,
    /vulnerability/i,
    /encryption/i
  ],
  hard: [
    /compare/i,
    /tradeoff/i,
    /refactor/i,
    /diagnose/i,
    /database query/i
  ],
  normal: [
    /build/i,
    /implement/i,
    /summarize/i
  ],
  easy: [
    /simple/i,
    /one word/i,
    /quick question/i,
    /yes or no/i
  ]
};

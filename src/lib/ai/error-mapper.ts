export function mapAIError(errorCode?: string | null): string {
  switch (errorCode) {
    case 'RATE_LIMIT_EXCEEDED':
      return "You're sending messages too fast. Please wait a moment and try again.";
    case 'CONCURRENCY_LIMIT_EXCEEDED':
      return "The system is currently busy helping other users. Please try again in a few seconds.";
    case 'ABUSE_PROTECTION_BLOCKED':
      return "Your request was blocked by our abuse protection system.";
    case 'SECURITY_VIOLATION':
    case 'SECURITY_TIMEOUT_FAIL_CLOSED':
      return "I cannot fulfill this request due to safety or security constraints.";
    case 'BUDGET_EXCEEDED':
      return "Your AI token budget has been exhausted. Please wait for it to reset.";
    case 'MAX_ITERATIONS_EXCEEDED':
      return "I was unable to complete this task within the allowed number of steps. Please try simplifying your request.";
    case 'RAG_UNAVAILABLE':
    case 'RAG_UNAVAILABLE_EMBEDDING_FAILURE':
      return "My knowledge base is currently unavailable. I can only provide general answers right now.";
    default:
      return "An unexpected error occurred while processing your request. Please try again.";
  }
}

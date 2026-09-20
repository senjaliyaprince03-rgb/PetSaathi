/**
 * Text sanitization and HTML escaping utilities to prevent Stored XSS (BUG-018).
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

/**
 * Escapes characters that have special meaning in HTML contexts.
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str.replace(/[&<>"'/]/g, (match) => HTML_ESCAPE_MAP[match] ?? match);
}

/**
 * Sanitizes free-text user input by stripping HTML tags, control characters,
 * and dangerous script schemes before database persistence.
 */
export function sanitizeFreeText(input?: string | null): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove full script blocks
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Remove style blocks
    .replace(/<[^>]*>/g, "") // Strip any remaining HTML tags
    .replace(/javascript:/gi, "") // Remove inline javascript: schemes
    .replace(/data:text\/html/gi, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // Remove ASCII control chars
    .trim();
}
